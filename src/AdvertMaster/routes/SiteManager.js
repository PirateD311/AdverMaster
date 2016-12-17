/**
 * Created by liuxun on 16/11/28.
 */
const router = require('express').Router();
const Auth = require('../lib/middleware/authority/AuthrityManager');
const SiteManagerModel = require('../lib/model/SiteManagerModel');
const SiteModel = require('../lib/model/SiteModel');
const ReportModel = require('../lib/model/StatReportModel');
const BillModel = require('../lib/model/BillModel');


router.all('/:option',Auth.processSiteManagerAuth,function(req,res,next)
{
    logger.info("Auth Success.Request Body:\n %s",JSON.stringify(req.body));
    next();
});
//router.all('/site',function(req,res,next)
//{
//    logger.info("Request Body:\n %s",JSON.stringify(req.body));
//    //SiteManagerModel.getSiteInfo({sOwnerUserName:req.session.logged_username})
//    SiteManagerModel.getSiteInfo({sOwnerName:"站长1"})
//    .then(sites=>res.render('SiteManager/index',{rightViewName:"site",siteInfos:sites}))
//    .catch(err=>res.send(err));
//});
router.all('/index',function(req,res,next)
{
    res.render('SiteManager/admin-index');
});
router.all('/site',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sWebState",options:['正常','锁定']}]};
        var data = req.body;
        data.nOwnerUid = req.session.logged_uid;
        data.sOwnerName = req.session.logged_username;

        SiteModel.getSite(data)
        .then(sites=>
        {
            res.render('SiteManager/admin-site',{data:{sites:sites,query:query_item}});
        });
    }catch(e)
    {
        res.send(e);
    }
});
router.get('/site/create',function(req,res,next){
    try
    {
        res.render('SiteManager/admin-site-createform');
    }catch(e)
    {
        res.send(e);
    }
});
router.post('/site/create',function(req,res,next){
    try
    {
        req.body.nOwnerUid = req.session.logged_uid;
        req.body.sOwnerName = req.session.logged_username;
        console.log(req.body);
        SiteModel.createSite(req.body)
        .then(site=>{
                res.render('redirect',{info:"新建站点成功！",href:'/siteManager/site'});
        })
        .catch(err=>{throw  new Error(err)});
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/advertCode',function(req,res,next)
{
    //对网站主，他只选择广告的类型和尺寸，不针对广告进行选择。
    res.render('SiteManager/admin-advertCode');
});

router.all('/report/site',function(req,res,next){
    try
    {
        var query_item = {date:"sDate"};
        var data = {};
        data.sOwnerName = req.session.logged_username;
        data.nOwnerUid = req.session.logged_uid;
        ReportModel.getSiteReport(data)
        .then(reports=>
        {
            //广告全平台扣量
            for(value of reports)
            {
                value.nMoney = parseInt(CONFIG.SITE_COUNT_DISCOUNT * value.nMoney);
                value.nCount = parseInt(CONFIG.SITE_COUNT_DISCOUNT * value.nCount);
            }
            res.render('SiteManager/admin-report-site',{data:{reports:reports,query:query_item}});
        });
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/bill',function(req,res,next){
    try
    {
        var data = req.body;
        data.sTo = req.session.logged_username;
        BillModel.getBill(data)
            .then(bills=>{
                res.render('SiteManager/admin-bill',{data:{bills:bills}});
            })
            .catch(e=>res.send(e))
    }catch(e)
    {

    }
});

//router.all('/report',function(req,res,next)
//{
//    //logger.info("Request Body:\n %s",JSON.stringify(req.body));
//    var data = {};
//    //data.nOwnerUid = req.session.logged_uid;
//    data.nOwnerUid = 1;
//    try
//    {
//        StatReprotModel.getSiteReport(data)
//            .then(reports=>res.render('SiteManager/index',{rightViewName:"report",siteInfos:reports}))
//            .catch(err=>res.send(err));
//    }catch(err)
//    {
//        return res.send(err);
//    }
//
//});

function processSiteManager(req,res,next){
    var siteInfo = {
        "nSiteId" : 1,
        "sOwnerUserName" : "站长1",
        "sWebIp" : "13235",
        "sWebDomain" : "1251245",
        "nAdvertId" : "1",
        "sWebCategory" : "新闻",
        "sWebState" : "正常",
        "sWebRegisterDate" : "2016-11-25 14:33:48",
    };
    var advertInfo = {
        "nAdvertId" : 5,
        "sOwnerName" : "广告主1",
        "sName" : "测试广告啊",
        "sDisplayType" : "富媒体",
        "nAdvertPrice" : 4,
        "nStock" : 100,
        "nDayStock" : 10,
        "sChargeType" : "cpc",
        "sHref" : "www.baidu.com",
        "nMaterialId" : 6,
        "sCreateTime" : "2016-11-26 15:34:15",
        "sAdvertState" : "正常",
    };
    var payBill = {
        sBeginDate:"2016-11-21",
        sEndDate:"2016-11-22",
        nPreTaxPay:189,
        nAftTaxPay:189,
        sBillState:"未打款",
        sPayDate:"",
    };
    switch (req.params.options)
    {
        case "index":
            return res.render('SiteManager/index');
            break;
        case "site":
            SiteManagerModel.getSiteInfo(
                {sOwnerUserName:"站长1"},
                function(err,sites){
                    if(err)res.send(err);

                    return res.render('SiteManager/index',{rightViewName:"site",siteInfos:sites});
                });
            break;
        case "advert":
            SiteManagerModel.getAdvert(
                {},
                function(err,adverts){
                    if(err)res.send(err);
                    return res.render('SiteManager/index',{rightViewName:"advert",adverts:adverts});
                }
            )
            break;
        case "report":
            return res.render('SiteManager/index',{rightViewName:"report",siteInfos:[siteInfo,siteInfo,siteInfo]});
            break;
        case "paybill":
            return res.render('SiteManager/index',{rightViewName:"paybill",payBills:[payBill,payBill,payBill]});
            break;
    }
}

module.exports = router;