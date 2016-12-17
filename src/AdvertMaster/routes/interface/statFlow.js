/**
 * Created by liuxun on 16/11/9.
 */
var router = require("express").Router();
const DBManager = require("../../lib/database/MongoDBManager").DBManager;
const Util = require("../../lib/myutil");
const FlowStatManager = require("../../lib/flowstat/FlowStatManager");
const Auth = require("../../lib/middleware/authority/AuthrityManager");
const AdvertModel = require("../../lib/model/AdvertModel");
var advertId = 0;

router.all('/:option',Auth.processSiteAuth,function(req,res,next){
    try
    {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");

    req.body.sVisitorIp = req.headers['x-real-ip']||req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var result = {code:RESULT_CODE_NOTFOUND,data:[]};
    console.log(req.headers);
    //console.log(req.connection);
    var query = {
        nSiteId:req.body.site.nId,
        sRemoteIp:req.body.sVisitorIp,
        sDate:{
            $gt: new Date().toLocaleDateString()+" 00:00:00",
            $lt: new Date().toLocaleDateString()+" 23:59:59"
        }
    };

    //检查流量访问记录，以排除访客今日访问过得广告
    DBManager.getFlowDetailRecord()
    .find(query)
    .then(records=>
    {
        var ViewAdvertFilter = [];
        var ClickAdvertFilter = [];
        for(value of records)
        {
            if(value.sStatType == 'cpv')ViewAdvertFilter.push(value.nAdvertId);
            if(value.sStatType == 'cpc')ClickAdvertFilter.push(value.nAdvertId);
        }


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
        .find({$or:[q1,q2]})
        .sort({nAdvertPrice:-1})
        //AdvertModel.getAdvertInfo(data)

    })
    .then(adverts=>{
        console.log("adverts:\n%s",JSON.stringify(adverts));
        if(adverts.length < 1)return Promise.reject("广告不存在");
        //检查库存

        //检查时段

        var FieldFilter = ['sName','sHref','sDisplayType','sSize','sMaterialSrc'];
        for(value of adverts)
        {

        }
        var advert = Util.filter(FieldFilter,adverts[0]);

        //流量统计
        // 统计广告流量 nSiteId","sSiteIp","sRemoteIp","nAdvertId","sAdvertName","sStatType"
        var flowDetailRecord = {
            "site":req.body.site,

            "sVisitorIp":req.body.sVisitorIp,
            "advert":adverts[0],

            "sStatType":'cpv',
        };
        req.body.advert = advert;
        req.body.flowDetailRecord = flowDetailRecord;
        next();
    })
    .catch(err=>{
        console.log(err);
        res.send({code:RESULT_CODE_NOPERMISSION,info:err});
    });
    }catch(e)
    {
        console.log('Error!!! %s',e);
        res.send({code:RESULT_CODE_NOPERMISSION,info:e});
    }

    //next();
});

//广告类型表
//type 1:富媒体、CPC、右下、200x300、普通广告
router.all('/getAdvert',function(req,res,next){
    try
    {
        var result = {code:RESULT_CODE_NOTFOUND,data:[]};
        req.body.flowDetailRecord.sStatType = ADVERTCHARGETYPE_VIEW;
        FlowStatManager.processFlowDetail(req.body.flowDetailRecord);
        result.code = RESULT_CODE_SUCCESS;
        result.data.push(req.body.advert);
        console.log(result);
        return res.send(result);

    }catch(e)
    {
        console.log('Error!!! %s',e);
        res.send({code:RESULT_CODE_NOPERMISSION,info:e});
    }
});


router.all('/handleClick',function(req,res,next){
    var result = {code:RESULT_CODE_NOTFOUND,data:[]};
    req.body.flowDetailRecord.sStatType = ADVERTCHARGETYPE_CLICK;
    FlowStatManager.processFlowDetail(req.body.flowDetailRecord);
    result.code = RESULT_CODE_SUCCESS;
    result.info = 'handleClick';
    console.log(result);
    return res.send(result);
});
//router.all('/getAdvert',function(req,res,next){
//
//});
//
//router.post('/:option',function(req,res,next){
//    console.log("广告请求");
//
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//    res.header("X-Powered-By",' 3.2.1')
//    res.header("Content-Type", "application/json;charset=utf-8");
//    var sVisitorIp = req.headers['x-real-ip']||req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||
//        req.socket.remoteAddress ||
//        req.connection.socket.remoteAddress;
//    var sSiteName = req.body.hostname;
//    var nAdvertId = req.body.nAdvertId;
//    //鉴权
//    Auth.processAdvertSiteAuth(sSiteName,res,function(err,siteDoc){
//        AdvertModel.getAdvertInfo(nAdvertId,function(err,advertDoc){
//        if(err)return res.send({code:RESULT_CODE_DBERROR,info:err});
//        switch (req.params.option){
//            case "getAdvert":
//                    var resultData = {code:RESULT_CODE_SUCCESS,data:[{sHref:"",sDisplayType:"",sSrc:""}]};
//                    console.log(advertDoc);
//                    resultData.data[0]["sHref"] = advertDoc.sHref;
//                    resultData.data[0]["sDisplayType"] = advertDoc.sDisplayType;
//
//                    if(advertDoc.sDisplayType == "富媒体" && advertDoc.nMaterialId){
//                        DBManager.getMaterial().findOne({nId:advertDoc.nMaterialId},function(err2,doc2){
//                            if(err2)return res.send({code:RESULT_CODE_DBERROR,info:err});
//                            if(!doc2)return res.send({code:RESULT_CODE_DBERROR,info:"富媒体广告资源id未找到"});
//                            resultData.data[0]["sSrc"] = doc2.sSrc;
//
//                            //统计广告流量 nSiteId","sSiteIp","sRemoteIp","nAdvertId","sAdvertName","sStatType"
//                            var flowDetailRecord = {
//                                "nSiteId":siteDoc.nSiteId,
//                                "sSiteIp":siteDoc.sWebIp,
//                                "sRemoteIp":sVisitorIp,
//                                "nAdvertId":advertDoc.nAdvertId,
//                                "sAdvertName":advertDoc.sAdvertName,
//                                "sStatType":"cpv"
//                            };
//                            console.log("begin processFlowDetailRecord");
//                            FlowStatManager.processAdvertShowReq(flowDetailRecord,function(err,record){});
//                            //FlowStatManager.processAdvertShowReq(sSiteName,nAdvertId,sVisitorIp);
//                            return res.send(resultData);
//                        });
//                    }else{
//                        FlowStatManager.processAdvertShowReq(sSiteName,nAdvertId,sVisitorIp);
//                        return res.send(resultData);
//                    }
//
//
//                break;
//            case "handleClick":
//                var flowDetailRecord = {
//                    "nSiteId":siteDoc.nSiteId,
//                    "sSiteIp":siteDoc.sWebIp,
//                    "sRemoteIp":sVisitorIp,
//                    "nAdvertId":advertDoc.nAdvertId,
//                    "sAdvertName":advertDoc.sAdvertName,
//                    "sStatType":"cpc"
//                };
//                console.log("begin processFlowDetailRecord");
//                FlowStatManager.processAdvertShowReq(flowDetailRecord,function(err,record){});
//                return res.send({code:1,info:"process click advert success."});
//                break;
//            default :
//                return res.send({code:RESULT_CODE_NOTFOUND,info:"Route not found."});
//
//        }
//        });
//    });
//
//
//
//
//
//
//});
//router.get('/',function(req,res,next){
//    console.log("广告请求");
//    var ip = req.headers['x-real-ip']||
//        req.headers['x-forwarded-for'] ||
//        req.connection.remoteAddress ||
//        req.socket.remoteAddress ||
//        req.connection.socket.remoteAddress;
//    console.log("ip:"+ip);
//    //console.log(req);
//    res.send("ddd");
//});

module.exports = router;