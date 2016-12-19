/**
 * Created by liuxun on 16/11/22.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const FlowStatManager = require('../flowstat/FlowStatManager');
const Util = require('../myutil');

function createAdvert(data,next){
    if(Util.field(['sOwnerName','nOwnerUid','sName','sHref'],data))
        return next('参数有误');
}

function getAdvertInfo(data){
    return new Promise((resolve,reject)=>
    {
        var query = Util.filter(['nId','nOwnerUid','sOwnerName','sName','sAdvertState','sDisplayType','sChargeType','nStock','nDayStock'],data);
        DBManager.getAdvertInfoModel().find(query||null)
        .then(adverts=>resolve(adverts))
        .catch(err=>reject(err));
    });
}
module.exports.getAdvertInfo = getAdvertInfo;

function lockAdvert(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getAdvertInfoModel()
        .findOneAndUpdate({'nId':data.nId},{sAdvertState:ADVERTSTATE_LOCK})
        .then(res=>{
            if(res)resolve(res)
            else reject('广告未找到');
        })
        .catch(err=>reject(err))
    });
}
module.exports.lockAdvert = lockAdvert;

function activeAdvert(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getAdvertInfoModel()
        .findOneAndUpdate({'nId':data.nId},{sAdvertState:ADVERTSTATE_NORMAL})
        .then(res=>{
            if(res)resolve(res)
            else reject('广告未找到');
        })
        .catch(err=>reject(err))
    });
}
module.exports.activeAdvert = activeAdvert;

function qryAdvertInfo(data,next){
    var query = {};
    if(data['sOwnerName'])
        query['sOwnerName'] = data['sOwnerName'];
    if(data['sTitle'])
        query['sTitle'] = data['sTitle'];
    if(data['sDisplayType'])
        query['sDisplayType'] = data['sDisplayType'];
    if(data['sAdvertState'])
        query['sAdvertState'] = data['sAdvertState'];

    DBManager.getAdvertInfoModel().find(
        query,
        function(err,adverts){
            if(err)return next(err);
            return next(null,adverts);
        });

}
module.exports.qryAdvertInfo = qryAdvertInfo;

function processAdvertReqFromSite(req,res)
{
    return new Promise((resolve,reject)=>
    {
        try
        {
            //设置头域
            Util.openCrossDomain(res);
            var host = req.body.hostname;
            var remote = Util.getRemoteIp(req);
            var q_FlowDetail = {
                sSiteDomain:host,
                sRemoteIp:remote,
                sDate:Util.get$ofTimeInToday(),
            };
            //查今日流量，找出已计费的广告
            DBManager.getFlowDetailRecord()
            .find(q_FlowDetail,{_id:-1,nAdvertId:1,sStatType})
            .then(records=>
            {
                var ViewAdvertFilter = [];
                var ClickAdvertFilter = [];
                for(value of records)
                {
                    if(value.sStatType == 'cpv')ViewAdvertFilter.push(value.nAdvertId);
                    if(value.sStatType == 'cpc')ClickAdvertFilter.push(value.nAdvertId);
                }

                //从库中选出有库存、时段类型等满足的未计费广告，并按价格/利润排序

                var data = {};

                data.sAdvertState = ADVERTSTATE_NORMAL;
                data.nStock = {$gt:0};
                data.nDayStock = {$gt:0};

                //请求的广告类型
                /*type 1:富媒体、CPV、右下、200x300、普通广告
                 * type 2:富媒体、CPC、右下、200x300、普通广告
                 * type 3:弹窗、右下、200x300、普通广告
                 * */
                if(req.body.advert_type == 1)
                {
                    data.sDisplayType = ADVERTTYPE_FMT;
                    //data.sChargeType = ADVERTCHARGETYPE_VIEW;
                }else if(req.body.advert_type == 2)
                {
                    data.sDisplayType = ADVERTTYPE_FMT;
                    //data.sChargeType = ADVERTCHARGETYPE_CLICK;
                }else if(req.body.advert_type == 3)
                {
                    data.sDisplayType = ADVERTTYPE_TC;
                }
                var q1 = {};
                for(var key in data)
                {
                    q1[key] = data[key];
                }
                q1.sChargeType = ADVERTCHARGETYPE_VIEW;
                q1.nId = {$nin:ViewAdvertFilter};

                var q2 = data;
                q2.sChargeType = ADVERTCHARGETYPE_CLICK;
                q2.nId = {$nin:ClickAdvertFilter};

                logger.debug("获取广告查询条件为:%s",JSON.stringify({$or:[q1,q2]},null,'\t'));
                return DBManager.getAdvertInfoModel()
                .findOne({$or:[q1,q2]})
                .sort({nAdvertPrice:-1})
                //.select(['sHref','sDisplayType','sSize','sMaterialSrc','sChargeType'])

            })
            .then(advert=>
            {
                if(!advert)throw new Error('库中无符合条件广告');
                logger.debug("adverts:\n%s",JSON.stringify(advert));

                //对此广告进行详细统计处理.
                var flowDetailRecord = {
                    "site":req.body.site,
                    "sVisitorIp":remote,
                    "advert":advert,
                    "sStatType":'cpv',
                };
                req.body.advert = advert;
                req.body.flowDetailRecord = flowDetailRecord;

                FlowStatManager.processFlowDetail(req.body.flowDetailRecord);

            });





        }catch(e)
        {
            logger.error(e);
        }
    });
}