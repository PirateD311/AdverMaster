/**
 * Created by liuxun on 16/11/9.
 */
const DBManager = require("../database/MongoDBManager").DBManager;
const Util = require("../myutil");
const logger = Util.getLogger;
var aStatCache = [];

function processFlowDetail(data)
{
    if(!Util.field(['sStatType','sVisitorIp','site','advert'],data))return false;
    var today = new Date().toLocaleDateString();
    var query = {
        nSiteId:data.site.nId,
        sRemoteIp:data.sVisitorIp,
        nAdvertId:data.advert.nId,
        sStatType:data.sStatType,
        sDate:{
            $gt:today+" 00:00:00",
            $lt:today+" 23:59:59",
        }
    };
    //查看今日是否统计过此次访问
    DBManager.getFlowDetailRecord()
    .findOne(query)
    .then(record=>{
        if(!record)
        {
            var record = {
                nSiteId:data.site.nId,
                sSiteIp:data.site.sWebIp,
                sSiteDomain:data.site.sWebDomain,

                sRemoteIp:data.sVisitorIp,
                nAdvertId:data.advert.nId,
                sAdvertName:data.advert.sName,
                advertDoc:data.advert,

                sStatType:data.sStatType,//cpc,cpm,cpv
                sDate:new Date().toLocaleString()
            };
            console.log(record);
            return DBManager.getFlowDetailRecord().create(record)
        }else{
            //计算CD，是否再添加一条,当前一个ip一天算一次，直接返回成功
            logger.info("记录CD中。。。");
            return Promise.resolve(record);
        }
    })
    .then(record=>{
        logger.info("统计完成");
        //满足广告计费条件时计费并扣量
        if((data.advert.sChargeType == ADVERTCHARGETYPE_VIEW && data.sStatType == 'cpv')
            ||(data.advert.sChargeType == ADVERTCHARGETYPE_CLICK && data.sStatType == 'cpc'))
        {
            DBManager.getAdvertInfoModel()
            .findOneAndUpdate({nId:data.advert.nId},{$inc:{nDayStock:-1,nStock:-1}})
        }

        //return DBManager.getFlowDetailRecord().find(query);
    })
    //.then(records=>{
    //    logger.debug("records length:%d",records.length);
    //    logger.debug("nMaxDayCount :%d",data.advert.nMaxDayCount * CONFIG.ADVERT_COUNT_DISCOUNT);
    //    if(records.length >= data.advert.nMaxDayCount * CONFIG.ADVERT_COUNT_DISCOUNT
    //        || records.length >= data.advert.nStock)
    //    {
    //        logger.debug("update...stock to 0");
    //        DBManager.getAdvertInfoModel().findOneAndUpdate({nId:data.advert.nId},{nDayStock:0}).catch(err=>logger.error(err))
    //    }
    //})
    .catch(err=>console.log(err));
}
module.exports.processFlowDetail = processFlowDetail;





function FlowStatManager(){
    this.processAdvertShowReq = function(data){
        var bIsStatFind = false;
        for(var i in aStatCache){
            if(aStatCache[i].sHostIp === data.sSiteIp && aStatCache[i].sAdvertId === data.nAdvertId && aStatCache[i].sVisitIp === data.sRemoteIp){
                if(data.sStatType == 'cpv')aStatCache[i].processView(data);
                else if(data.sStatType == 'cpc')aStatCache[i].processClick(data);
                bIsStatFind = true;
                return;
            }
        }
        if(!bIsStatFind){
            logger.debug("Stat Not found in Cache.")
            var oStat = new StatBase(data);
            if(data.sStatType == 'cpv')oStat.processView(data);
            else if(data.sStatType == 'cpc')oStat.processClick(data);

            aStatCache.push(oStat);
        }
    };
}
module.exports.FlowStatManager = new FlowStatManager();
function StatBase(data){
    this.sHostIp = data.sSiteIp;
    this.sAdvertId = data.nAdvertId;
    this.sVisitIp = data.sRemoteIp;
    this.nCPM = 0;
    this.nCPC = 0;
    this.nCPA = 0;
    this.nCPV = 0;
    this.isLockCPC = false;
    this.isLockCPM = false;
    this.isLockCPA = false;
    this.isLockCPV = false;
    var self = this;

    const CPC_LOCK_TIME = 30000;
    const CPA_LOCK_TIME = 30000;
    const CPM_LOCK_TIME = 5000;
    const CPV_LOCK_TIEM = 30000;
    //private function

    var lockCPC = function(){
        if(!self.isLockCPC){
            self.isLockCPC = true;

            setTimeout(function(){
                self.isLockCPC = false;
                logger.debug("UnLock CPC.Lock is :"+self.isLockCPC);

            },CPC_LOCK_TIME);
            logger.debug("Lock CPC.");
        }
    };


    var lockCPV = function(){
        if(!self.isLockCPV){
            self.isLockCPV = true;

            setTimeout(function(){
                self.isLockCPV = false;
                logger.debug("UnLock CPV.Lock is :"+self.isLockCPV);

            },CPM_LOCK_TIME);
            logger.debug("Lock CPV.");
        }
    };


    var synchronWithDB = function(){
        return new Promise((resolve,reject)=>{
            var record_key = {sSiteIp:self.sHostIp,sRemoteIp:self.sVisitIp,sAdvertId:self.sAdvertId};
            DBManager.getFlowDetailRecord()
                .findOne(record_key)
                .then(record=>{
                    if(record)
                    {
                        self.nCPM = record.nCPM;
                        self.nCPC = record.nCPC;
                        self.nCPA = record.nCPA;
                        logger.info("Host[%s] synchronWithDB success.",self.sHostIp);
                        resolve(record);
                    }else
                    {
                        DBManager.getFlowDetailRecord.create(record_key)
                        .then(record => resolve(record))
                        .catch(err => reject(err))
                    }
                })
                .catch(err => reject(err))
        });
    };
   //synchronWithDB(function(){});
    var updateDB = function(){
        logger.info("Before Modify:"+self.showStat());
        DBManager.getAdvertFlowStatMode().findOneAndUpdate({"sSiteIp":self.sHostIp,sAdvertId:self.sAdvertId,sRemoteIp:self.sVisitIp},{nCPC:self.nCPC,nCPA:self.nCPA,nCPM:self.nCPM,nCPV:self.nCPV},function(err){
            if(err)throw err;
            logger.info("After Modify:"+self.showStat());
        });

    }
    //private function end;

    //public function begin
    this.processView = function(data){
        logger.info("flowStat::handleView()");
        if(self.isLockCPV){
            console.log("Visitor CPM locked.don't stat.");
            return false;
        }else{
            lockCPV();
            synchronWithDB()
            .then(record =>{
                self.nCPM++;
                self.processFlowDetailRecord(data,function(){});
            })
        }
    };
    this.processClick = function(data){
        logger.info("flowStat::processClick()");
        if(self.isLockCPC){
            console.log("Visitor CPM locked.don't stat.");
            return false;
        }else{
            lockCPC();
            synchronWithDB(function(){
                self.nCPC++;
                self.processFlowDetailRecord(data,function(){});
                //updateDB();
            });
        }
    }

    this.processFlowDetailRecord = function(data,next){
        console.log("processFlowDetailRecord");
        data = Util.field(["nSiteId","sSiteIp","sRemoteIp","nAdvertId","sStatType"],data);
        if(!data)return next("参数不合法",null);
        data["sDate"] = new Date().toLocaleString();
        DBManager.addFlowDetailRecord(data,function(err,record){
            if(err)return next(err,null);
            return next(null,record);
        });
    }

    this.showStat = function(){
        var sStatInfo = "\nsHostIp : "+this.sHostIp+"\tsAdvertId : "+this.sAdvertId+"\tsVisitorIp : "+this.sVisitIp+"\n";
        sStatInfo += "CPC : "+this.nCPC+"\t"+"CPA : "+this.nCPA+"\t"+"CPM : "+this.nCPM+"\n";
        sStatInfo += "*************************************************";
        return sStatInfo;
    }

}





