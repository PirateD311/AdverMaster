/**
 * Created by liuxun on 16/12/2.
 */
const router = require('express').Router();
const Util = require('../lib/myutil');
const Auth = require('../lib/middleware/authority/AuthrityManager');
const UserModel = require('../lib/model/UserModel');
const AdvertModel = require('../lib/model/AdvertModel');
const SiteModel = require('../lib/model/SiteModel');
const ReportModel = require('../lib/model/StatReportModel');
const BillModel = require('../lib/model/BillModel');
const DBManager = require('../lib/database/MongoDBManager').DBManager;

router.all('/:options',Auth.processBussinessManagerAuth,function(req,res,next){
    console.log("AdminController.");
    next();
})

router.all('/index',function(req,res,next){
    console.log("AdminController/index");
    res.render('Admin/admin-index');
});

router.all('/user',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sUserType",options:[USERTYPE_ADVERTISER,USERTYPE_SITE_MASTER]}]};
        UserModel.getUser(req.body)
            .then(users=>res.render('Admin/admin-user',{data:{users:users,query:query_item}}))
    }catch(e)
    {
        res.send(e);
    }
});
router.all('/user/active',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sUserType",options:['站长','广告主']}]};
        var data = Util.filter(['nId'],req.body);
        UserModel.activeUser(data)
            .then(users=>res.render('redirect',{info:"激活用户成功！",href:'/admin/user'}))
    }catch(e)
    {
        res.send(e);
    }
});
router.all('/user/lock',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sUserType",options:['站长','广告主']}]};
        var data = Util.filter(['nId'],req.body);
        UserModel.lockUser(data)
            .then(users=>res.render('redirect',{info:"锁定用户成功！",href:'/admin/user'}))
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/advert',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sDisplayType",options:['富媒体','弹窗']}]};

        AdvertModel.getAdvertInfo(req.body)
        .then(adverts=>
            {
                res.render('Admin/admin-advert',{data:{adverts:adverts,query:query_item}})
            })
    }catch(e)
    {
        res.send(e);
    }
});

router.get('/advert/create',function(req,res,next){
    try
    {
        var data = {
            advertisers:[],
            sDisplayType:[ADVERTTYPE_FMT,ADVERTTYPE_TC],
            sChargeType:[ADVERTCHARGETYPE_VIEW,ADVERTCHARGETYPE_CLICK],
        };
        var qry_advertiser = {sUserType:USERTYPE_ADVERTISER,sUserState:USERSTATE_NORMAL};
        UserModel.getUser(qry_advertiser)
            .then(advertisers=>
            {
                data.advertisers = advertisers;
                res.render('Admin/admin-advert-createform',{data:data});
            })
    }catch(e)
    {
        res.send(e);
    }
});
router.post('/advert/edit',function(req,res,next){
    try
    {
        //if(!Util.field(['advert'],req.body))throw new Error('编辑失败');
        var data = Util.field(['nId'],req.body);
        if(!data)throw new Error('编辑失败');
        AdvertModel.getAdvertInfo(data)
        .then(advert=>{
                res.render('Admin/admin-advert-editform',{data:{advert:advert[0]}});
            })

    }catch(e)
    {
        res.send(e);
    }
});

router.post('/advert/lock',function(req,res,next){
    try
    {
        var data = Util.filter(['nId'],req.body);
        AdvertModel.lockAdvert(data)
        .then(users=>res.render('redirect',{info:"锁定广告成功！",href:'/admin/advert'}))
    }catch(e)
    {
        res.send(e);
    }
});
router.post('/advert/active',function(req,res,next){
    try
    {
        var data = Util.filter(['nId'],req.body);
        AdvertModel.activeAdvert(data)
            .then(users=>res.render('redirect',{info:"激活广告成功！",href:'/admin/advert'}))
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/site',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sWebState",options:['正常','锁定']}]};
        SiteModel.getSite(req.body)
        .then(sites=>
        {
            res.render('Admin/admin-site',{data:{sites:sites,query:query_item}});
        });
    }catch(e)
    {
        res.send(e);
    }
});
router.all('/site/active',function(req,res,next){
    try
    {
        var data = Util.filter(['nId'],req.body);
        data.set = {sWebState:CONST.SITE_STATE_NORMAL};
        SiteModel.updateOneSiteById(data)
            .then(users=>res.render('redirect',{info:"激活站点成功！",href:'/admin/site'}));
    }catch(e)
    {
        res.send(e);
    }
});
router.all('/site/lock',function(req,res,next){
    try
    {
        var data = Util.filter(['nId'],req.body);
        data.set = {sWebState:CONST.SITE_STATE_LOCK};
        SiteModel.updateOneSiteById(data)
            .then(users=>res.render('redirect',{info:"锁定站点成功！",href:'/admin/site'}));
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/report/advert',function(req,res,next){
    try
    {
        var query_item = {date:"sDate",category:[{name:"sAdvertName",options:[]}]};
        DBManager.getAdvertInfoModel()
        .find()
        .select('sName')
        .then(adverts=>
        {
            for(var name of adverts)
            {
                query_item.category[0].options.push(name.sName);
            }
            return ReportModel.getAdvertReport(req.body)
        })
        .then(reports=>
        {
            res.render('Admin/admin-report-advert',{data:{reports:reports,query:query_item}});
        })
        .catch(e=>
        {
            logger.debug(e);
        });
    }catch(e)
    {
        res.send(e);
    }
});

router.all('/report/site',function(req,res,next){
    try
    {
        var query_item = {date:"sDate"};
        ReportModel.getSiteReport(req.body)
            .then(reports=>
            {
                res.render('Admin/admin-report-site',{data:{reports:reports,query:query_item}});
            });
    }catch(e)
    {
        res.send(e);
    }
});

router.get('/bill/create',function(req,res,next){
    try
    {
        var data = {

        };
        res.render('Admin/admin-bill-createform');
    }catch(e)
    {

    }
});

router.post('/bill/create',function(req,res,next){
    try
    {
        BillModel.createBill(req.body)
        .then(bill=>res.render('redirect',{info:"创建成功！",href:'/admin/bill'})).catch(e=>res.send(e));
    }catch(e)
    {

    }
});
router.all('/bill',function(req,res,next){
    try
    {
        BillModel.getBill(req.body)
        .then(bills=>{
            res.render('Admin/admin-bill',{data:{bills:bills}});
            })
        .catch(e=>res.send(e))
    }catch(e)
    {

    }
});


module.exports = router;