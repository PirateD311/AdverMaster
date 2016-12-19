/**
 * Created by liuxun on 16/11/28.
 */
const router = require('express').Router();
const Auth = require('../lib/middleware/authority/AuthrityManager');
const AdvertModel = require('../lib/model/AdvertModel');
const ReportModel = require('../lib/model/StatReportModel');
const BillModel = require('../lib/model/BillModel');
const DBManager = require('../lib/database/MongoDBManager').DBManager;

router.all('/:option',Auth.processAdvertiserAuth,function(req,res,next){
    //鉴权
    next();
});
router.all('/index',function(req,res,next){
    res.render('Advertiser/admin-index');
});

router.all('/advert',function(req,res,next){
    try
    {
        var query_item = {category:[{name:"sDisplayType",options:['富媒体','弹窗']}]};
        var data = req.body;
        data.nOwnerUid = req.session.logged_uid;
        data.sOwnerName = req.session.logged_username;
        console.log(data);
        AdvertModel.getAdvertInfo(data)
        .then(adverts=>{
                res.render('Advertiser/admin-advert',{data:{adverts:adverts,query:query_item}})
        })
        .catch(e=>res.send(e));
    }catch(e)
    {

    }
});


router.all('/report/advert',function(req,res,next){
    try
    {
        var query_item = {date:"sDate",category:[{name:"sAdvertName",options:[]}]};

        var data = req.body;
        data.nOwnerUid = req.session.logged_uid;

        DBManager.getAdvertInfoModel()
        .find({nOwnerUid:req.session.logged_uid})
        .select('sName')
        .then(adverts=>
        {
            for(var name of adverts)
            {
                query_item.category[0].options.push(name.sName);
            }
            logger.debug(data);
            return ReportModel.getAdvertReport(data)
        })
        .then(reports=>
        {
            var options = new Set();
            //广告主扣量
            for(value of reports)
            {
                options.add(value.sAdvertName);

                value.nCost = parseInt(value.nCost / CONFIG.ADVERT_COUNT_DISCOUNT);
                //value.nMoney = parseInt(value.nMoney / CONFIG.ADVERT_COUNT_DISCOUNT);
                value.nMoney = value.nCost * value.nAdvertPrice;
            }

            res.render('Advertiser/admin-report-advert',{data:{reports:reports,query:query_item}});
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
        data.sFrom = req.session.logged_username;

        BillModel.getBill(data)
            .then(bills=>{
                res.render('Advertiser/admin-bill',{data:{bills:bills}});
            })
            .catch(e=>res.send(e))
    }catch(e)
    {

    }
});

router.all('/user',function(req,res,next){
    try
    {
        DBManager.getUserModel().findOne({nId:req.session.logged_uid})
        .then(user=>
        {
            res.render('Advertiser/admin-user',{data:{user:user}});
        })
        .catch(err=>
        {
            res.send(e);
        });
    }catch(e)
    {

    }
})


module.exports = router;