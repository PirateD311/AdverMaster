/**
 * Created by liuxun on 16/11/17.
 */
var router = require('express').Router();
var Auth = require("../../lib/middleware/authority/AuthrityManager");
var DBManager = require("../../lib/database/MongoDBManager").DBManager;
var logger = require("../../lib/myutil").getLogger;
var FileUpload = require('../../lib/middleware/FileUpload');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/img')
    },
    filename: function (req, file, cb) {
        var fileFormat = "."+(file.originalname).split(".")[1];
        cb(null, file.fieldname + '_' + Date.now()+fileFormat);
    }
})
var upload = multer({storage:storage}).single('material');

function uploadPro(req,res)
{
    return new Promise((resolve,reject)=>
    {
       upload(req,res,function(err)
       {
           if(err)
            reject(err);
           else{
               resolve(req.file);
           }
       }) ;
    });
}

//router.post("/",Auth.processBussinessManagerAuth,function(req,res,next){
router.post("/",function(req,res,next){
    console.log("PostBegin");
    var advertInfo = {};
    uploadPro(req,res)
    .then(file=>{
            logger.info(file);
            if(file)advertInfo.sMaterialSrc = CONFIG.APP_DOMAIN+file.path.replace('public/','');
            else logger.info("未上传素材");

            return DBManager.getUserModel()
                .findOne({sUserName:req.body.sOwnerName,sUserType:USERTYPE_ADVERTISER,sUserState:USERSTATE_NORMAL})

        })
    .then(advertiser=>{
            logger.warn(advertiser);
        if(!advertiser)
        {
            logger.warn("广告主未找到");
            return res.send('广告主不存在');
        }
        else
        {


            advertInfo.nOwnerUid = advertiser.nId;
            advertInfo.sOwnerName = advertiser.sUserName;

            advertInfo.sName = req.body.sName;
            advertInfo.sDescription = req.body.sDescription;
            advertInfo.sHref = req.body.sHref;

            advertInfo.sDisplayType = req.body.sDisplayType;
            advertInfo.sChargeType = req.body.sChargeType;
            advertInfo.nAdvertPrice = req.body.nAdvertPrice;
            advertInfo.nSitePrice = req.body.nSitePrice;

            advertInfo.nMaxCount = req.body.nMaxCount;
            advertInfo.nMaxDayCount = req.body.nMaxDayCount;
            advertInfo.nStock = req.body.nMaxCount;
            advertInfo.nDayStock = req.body.nMaxDayCount;

            if(req.body.nId)
            {
                var query = {nId:req.body.nId};
                return DBManager.getAdvertInfoModel().findOneAndUpdate(query,advertInfo)
            }else
            {
                return DBManager.getAdvertInfoModel().create(advertInfo);
            }

        }
    })
    .then(advert=>
        {
            return res.render('redirect',{info:"创建成功！",href:"/admin/advert"});
        })
    .catch(err=>{
            logger.error(err);
            return res.send(err);
        });
})


module.exports = router;