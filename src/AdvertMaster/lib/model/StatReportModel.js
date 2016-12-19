/**
 * Created by liuxun on 16/11/24.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');
//const Util = require('../myutil');
var events = require('events');

/*根据详细统计的筛选项，计算统计数据
 *data
 * 必选参数：
 * sReportType :site /advert
 * site下必选：
 * nSiteId,sSiteDomain,sSiteIp,nSitePrice
 * advert下必选：
 * nAdvertId,sAdvertName,sChargeType,nAdvertPrice,nDayCost,nMaxDayCount
 *query
 * 可选参数：
 * nAdvertId
 * nSiteId:
 * sRemoteIp:
 * sDate:
 * sStatType
 *
* */
function countAdvertReportByQuery(data,query)
{
    return new Promise((resolve,reject)=>{

        //if(!Util.field(['nSiteId','sSiteDomain','sSiteIp','nSitePrice'],data))
        //    reject('缺少站点信息');
        if(!Util.field(['nId','sName','sChargeType','nAdvertPrice','nMaxDayCount'],data))
            reject('缺少站点信息');

        var report = {};

        //获取详细流量统计
        DBManager.getFlowDetailRecord()
        .find(query)
        .then(records=>{

            //计算报表
            logger.info("今日流量数：%d",records.length);
            report.nDayCost = records.length;
            report.nMoney = data.nAdvertPrice * report.nDayCost ;
            report.nUpdateMoney = 0;
            report.sDate = query.sDate.$gt.substr(0,10);
            report.nOwnerUid = data.nOwnerUid;
            report.sOwnerName = data.sOwnerName;

            report.nAdvertId = data.nId;
            report.sAdvertName = data.sName;
            report.nAdvertPrice = data.nAdvertPrice;
            report.sChargeType = data.sChargeType;
            report.sDisplayType = data.sDisplayType;

            report.nMaxDayCount = data.nMaxDayCount;
            report.nMaxCount = data.nMaxCount;

            report.aSiteId = [];
            for(var value of records)
            {
                report.aSiteId.push(value.nSiteId);
            }
            report.aFlowStatDetail = records;

            //修改或创建今日报表
            return DBManager.getAdvertDailyStatReport()
            .findOneAndUpdate({nAdvertId:report.nAdvertId,sDate:report.sDate},report)
            .then(oldreport=>{
                if(oldreport)
                {
                    //由于若已生成过，则广告余量已更新，则计算消耗时只计算变动的量
                    report.nUpdateCost = report.nDayCost - oldreport.nDayCost;
                    report.nUpdateMoney = report.nMoney - oldreport.nMoney;
                    logger.debug("Report Exist.Update.");
                    return report;
                }else{
                    return DBManager.getAdvertDailyStatReport().create(report);
                }
            })
            .catch((err)=>reject(err));

        })
        .then(report=>{
            logger.debug('今日报表创建成功');
            logger.debug(report);

            //修改广告库存等信息
            var update = {};

            if(report.nUpdateCost != undefined)
                update.nStock = data.nStock-report.nUpdateCost;
            else
                update.nStock = data.nStock-report.nDayCost;


            update.nDayStock = data.nMaxDayCount - report.nDayCost;
            logger.debug("实时计费库存为：%d  ,报表计算库存为:%d",data.nDayStock,update.nDayStock);
            return DBManager.getAdvertInfoModel().findOneAndUpdate({nId:data.nId},update);
        })
        .then((advert)=>
        {
            logger.debug("广告[#%d] 今日消耗 %d",data.nId,report.nMoney);
            return DBManager.getUserModel().findOneAndUpdate({nId:data.nOwnerUid},{$inc: {nBalance:report.nUpdateMoney}});
        })
        .then(oldUser=>
        {
            logger.debug("%s 此前余额为:%d",oldUser.sUserName,oldUser.nBalance);
            resolve();
        })
        .catch(err=>reject(err));
    });
}

function countSiteManagerReportByQuery(data,query)
{
    return new Promise((resolve,reject)=>{
        DBManager.getFlowDetailRecord()
        .find(query)
        .then(records=>{
            var aAdvertPriceCount = {};
            var report = {};
            report.nSiteId = data.nId;
            report.sSiteDomain = data.sWebDomain;
            report.sSiteIp = data.sWebIp;
            report.nOwnerUid = data.nOwnerUid;
            report.sOwnerName = data.sOwnerName;
            report.sDate = query.sDate.$gt.substr(0,10);

            report.nCount = 0;
            report.nMoney = 0;
            report.aFlowStatDetail = [];
            logger.debug('SiteReportRecord...');
            logger.debug(records);
            for(var value of records)
            {
                if(value.sStatType == value.advertDoc.sChargeType)
                {
                    report.nMoney += value.advertDoc.nSitePrice;
                    report.nCount++;
                    report.aFlowStatDetail.push(value);
                }
            }

            return DBManager.getSiteDailyStatReport()
                .findOneAndUpdate({nSiteId:report.nSiteId,sDate:report.sDate},report)
                .then(oldreport=>{
                    if(oldreport)
                    {
                        logger.debug("Site Report Exist.Update.");
                        return report;
                    }else{
                        logger.debug("Site Report Not Exist.Create.");
                        return DBManager.getSiteDailyStatReport().create(report);
                    }

                })
                .catch((err)=>reject(err));

        })
        .catch(err=>reject(err))
    });
}
function everyDayAdvertReport()
{
    var today = {
        $gt: new Date().toLocaleDateString()+" 00:00:00",
        $lt: new Date().toLocaleDateString()+" 23:59:59"
    }
    //遍历广告列表
    DBManager.getAdvertInfoModel()
        .find({})
        .then(adverts=>{
            for(var value of adverts)
            {
                console.log("# %s 广告报表开始生成",value.nId);
                var query = {
                    'nAdvertId':value.nId,
                    'sAdvertName':value.sName,
                    'sStatType':value.sChargeType,
                    'sDate':today
                }
                countAdvertReportByQuery(value,query)
                    .then(()=>{console.log("生成报表成功!")})
                    .catch(err=>{logger.info(err)});
            }
        })
        .catch()
    //根据时间、广告id等查询详细统计表

    DBManager.getWebSiteModel()
    .find({})
    .then(sites=>{
        for(var value of sites)
        {
            console.log("# %s 站点报表开始生成",value.nId);
            var query = {
                'nSiteId':value.nId,
                'sSiteDomain':value.sWebDomain,
                'sDate':today
            }
            countSiteManagerReportByQuery(value,query)
                .then(()=>{console.log("生成站点报表成功!")})
                .catch(err=>{logger.info(err)});
        }
    })
    //计算统计数据
    //写统计项
}
module.exports.everyDayAdvertReport = everyDayAdvertReport;


/*站长每日报表
 *
 */
function countSiteManagerReport(data)
{
    return new Promise((resolve,reject)=>
    {
        logger.info("input:%s",JSON.stringify(data));

        if(!Util.field(['sName','sDate'],data))
            reject("");
        var user_report = {
            sDate:data.sDate,
            nMoney:0,
            nCount:0
        }

        DBManager.getWebSiteModel().find({sOwnerName:data.sName})
        .then(sites=>
        {
            return Promise.map(sites,(site)=>
                DBManager.getSiteDailyStatReport()
                    .findOne({
                        nSiteId:value.nSiteId,
                        sDate:user_report.sDate
                    })
                )
        })
        .then(reports=>
        {
            for(value of reports)
            {
                user_report.nMoney += value.nMoney;
                user_report.nCount += value.nCount;
            }
            logger.info('SiteManager Report :\n %s',JSON.stringify(user_report));
            resolve(user_report);
        })
        .catch(err=>reject(err));
    });
}
/*广告主每日报表
*
* */
function countAdvertiserReport(data)
{
    return new Promise((resolve,reject)=>
    {
        logger.info("input:%s",JSON.stringify(data));

        if(!Util.field(['sName','sDate'],data))
            reject("");

        var user_report = {
            sDate:data.sDate,
            nMoney:0,
            nCount:0
        }

        DBManager.getAdvertInfoModel()
        .find({sOwnerName:data.sName})
        .then(adverts=>
        {
            Promise.map(adverts,(advert)=>DBManager.getAdvertDailyStatReport().findOne({nAdvertId:advert.nId,sDate:user_report.sDate}))
        })
        .then(reports=>
        {
            for(value of reports)
            {
                user_report.nCount += value.nDayCost;
                user_report.nMoney += value.nMoney;
            }

            logger.info("%s reprot in %s : \n%s",
                data.sName,
                user_report.sDate,
                JSON.stringify(user_report)
            );
            resolve(user_report);
        })
        .catch(err=>reject(err))
    });
}

/*获取站长的每日报表
* */
function getSiteReport(data)
{
    var screen = ['nId','sDate','sCategory','sOwnerName','sSiteDomain'];
    var query = Util.filter(screen,data)||null;
    return DBManager.getSiteDailyStatReport().find(query);
}

module.exports.getSiteReport = getSiteReport;


function getAdvertReport(data)
{
    var screen = ['nId','sDate','sCategory','sOwnerName','sAdvertName','nOwnerUid','nAdvertId'];
    var query = Util.filter(screen,data)||null;
    return DBManager.getAdvertDailyStatReport().find(query);
}
module.exports.getAdvertReport = getAdvertReport;
//***************废弃**************************
/*统计报表、费用计算模块
* */


//function qryAdvertInfoAndStatCache(query,next){
//    query = query||[];
//    var advertQuery = query[0]||{};
//    var statQuery = query[1]||{};
//    var advertInfo = null;
//    var statsInfo = null;
//
//    var emitter = new events.EventEmitter();
//    emitter.addListener("error",function(err){
//        next(err,null);
//    });
//    emitter.addListener("QueryOk",function(type,res){
//        if(type == "advertInfo")advertInfo = res ;
//        if(type == "statsInfo")statsInfo = res ;
//        console.log("QueryOk::"+type);
//        console.log(res);
//        if(advertInfo && statsInfo)emitter.emit("success");
//    });
//    emitter.addListener("success",function(){
//
//        return next(null,[advertInfo,statsInfo]);
//
//    });
//
//
//    //检查广告id
//    DBManager.getAdvertInfoModel().findOne(query[0]||{},function(err,doc){
//        if(err)return next("数据异常",null);
//        if(!doc)return next("广告id不存在",null);
//        emitter.emit("QueryOk","advertInfo",doc);
//    });
//
//    //查流量统计表
//    DBManager.getAdvertFlowStatMode().find(query[1]||{},function(err,doc){
//        if(err)return next("数据异常",null);
//        if(!doc)return next("广告id不存在",null);
//
//        emitter.emit("QueryOk","statsInfo",doc);
//    });
//
//}
//
//
///*根据广告id计算该广告的费用
//* */
//function countCostByAdvertIdAndTime(data,next){
//    //data = Util.field(["nAdvertId"],data);
//    if(!data)return next("入参数无效",null);
//
//
//    qryAdvertInfoAndStatCache([{nAdvertId:3},{sAdvertId:"3"}],function(err,docs){
//        console.log(docs);
//        if(err)return next(err,null);
//        var advertInfo = docs[0];
//        var statsInfo = docs[1];
//        var price = advertInfo.nAdvertPrice;
//        var count = 0;
//        //switch (advertInfo.sChargeType)
//        switch ("cpc")
//        {
//            case "cpc":
//                for(var i in statsInfo){
//                    count += statsInfo[i].nCPC;
//                }
//                break;
//            case "cpv":
//                break;
//            default :
//                break;
//        }
//        var charge = price*count;
//        console.log("单价：【%d】 消耗量：【%d】  费用：【%d】",price,count,charge);
//    });
//
//}
//
//var test_data = {nAdvertId:3};
//
////countCostByAdvertIdAndTime(test_data,function(){
////   console.log("dddd");
////});
//
//
//
//
//
//function countAdvertCostByIdAndTime(data,next){
//
//    DBManager.getFlowDetailRecord().find(
//        {
//            nAdvertId:data.nAdvertId,
//            sDate:{$gt: "2016-11-25 15:43:39", $lt: "2016-11-25 15:48:39"}
//        },
//        function(err,recordDoc){
//            if(err) return next(err,null);
//            var price = 5;
//            var count = recordDoc.length;
//            var charge = price * count;
//            console.log("单价：【%d】 消耗量：【%d】  费用：【%d】",price,count,charge);
//            return next(null,charge);
//        }
//    )
//}
//
////countAdvertCostByIdAndTime(test_data,function(err,count){
////
////})
//
//
//
///* 根据流量记录生成当天全部统计报表
//* */
//function countDailyCostReport(data,next){
//    //获取所有状态正常的广告
//    DBManager.getAdvertInfoModel().find({sAdvertState:ADVERTSTATE_NORMAL},function(err,advertDocs){
//        if(err)return next(err);
//        advertDocs.map(function(advertDoc){
//            //检查是否需要生成
//            DBManager.getAdvertDailyStatReport().findOne(
//                {
//                    nAdvertId:advertDoc.nAdvertId,
//                    sDate:new Date().toLocaleDateString()
//                },
//                function(err,reportDoc){
//                    if(err)return next(err);
//                    if(reportDoc)return next("report 已创建");
//                    //获取详细流量记录
//                    DBManager.getFlowDetailRecord().find(
//                        {
//                            nAdvertId:advertDoc.nAdvertId,
//                            sStatType:advertDoc.sChargeType,
//                            sDate:{
//                                $gt: new Date().toLocaleDateString()+" 00:00:00",
//                                $lt: new Date().toLocaleDateString()+" 23:59:59"
//                            }
//                        },
//                        //创建流量记录
//                        function(err,recordDocs){
//                            if(err)return next(err);
//                            var price = advertDoc.nAdvertPrice;
//                            var quantity = recordDocs.length;
//                            var cost = price * quantity;
//                            showCost(advertDoc.nAdvertId,price,quantity,cost);
//                            //创建广告的每日统计
//                            DBManager.addAdvertDailyStatReport(
//                                {
//                                    sDate:new Date().toLocaleDateString(),
//                                    nAdvertId:advertDoc.nAdvertId,
//                                    sAdvertName:advertDoc.sName,
//                                    sChargeType:advertDoc.sChargeType,
//                                    nAdvertPrice:advertDoc.nAdvertPrice,
//                                    nCost:cost,
//                                    nQuantity:quantity,
//                                    nResidue:advertDoc.nStock-quantity,
//                                    aRawData:recordDocs
//                                },
//                                function(err){
//                                    if(err)return next(err);
//                                }
//                            );
//                            //更新广告信息中的库存
//                            DBManager.getAdvertInfoModel().findOneAndUpdate(
//                                {nAdvertId:advertDoc.nAdvertId},
//                                {nStock:advertDoc.nStock - quantity},
//                                function(err){return next(err)}
//                            );
//                        }
//                    );
//                }
//            );
//
//
//        });
//    });
//
//    //广告主每日统计报表
//    DBManager.getUserModel().find(
//        {
//            sUserType:USERTYPE_SITE_MASTER,
//            sUserState:USERSTATE_NORMAL
//        },
//        function(err,siteManagers)
//        {
//            if(err)return next(err);
//            siteManagers.forEach(
//
//            )
//        }
//
//    )
//}
//module.exports.countDailyCostReport = countDailyCostReport;
//
//function genSiteManagerReport(siteManager,next){
//    DBManager.getWebSiteModel().find(
//        {sOwnerUserName:siteManager.sUserName},
//        function(err,sites){
//            if(err)return next(err);
//            sites.map(function(site){
//
//            });
//        }
//    );
//}
//
//
//function showCost(advertId,price,count,cost){
//    logger.debug("广告:#%d  单价：【%d】 消耗量：【%d】  费用：【%d】",advertId,price,count,cost);
//}
//
////public function
//module.exports.qryAdvertiserReport = function(data,next){
//    var query = {};
//    if(data.nAdvertId)query.nAdvertId = data.nAdvertId;
//    if(data["sBeginDate"] && data["sEndDate"])
//        query["sDate"] = {$gt:data["sBeginDate"],$lt:data["sEndDate"]};
//
//    DBManager.getAdvertDailyStatReport().find(
//        query,
//        null,
//        {sort:{sDate:-1}},
//        function(err,reportDocs){
//            if(err)return next(err);
//            var resultJson = {code:0,info:"",data:[],tableStyle:{tableTitle:"",tableCategory:"",colTitle:"",colKey:[]}};
//            resultJson.code = RESULT_CODE_SUCCESS;
//            resultJson.tableStyle.tableTitle = "每日统计报表";
//            resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
//            resultJson.tableStyle.options = ["修改"];
//            resultJson.tableStyle.colTitle = "日期,广告项目,计费方式,量,单价,费用";
//            resultJson.tableStyle.colKey = ["sDate","sAdvertName","sChargeType","nQuantity","nAdvertPrice","nCost"];
//            resultJson.data = reportDocs;
//            return next(null,resultJson);
//        }
//    );
//}