/**
 * Created by liuxun on 16/11/18.
 */
var router = require("express").Router();
var DBManager = require("../../lib/database/MongoDBManager").DBManager;
var Auth = require("../../lib/middleware/authority/AuthrityManager");

router.post("/:option?",function(req,res,next){
    if(!req.params.option){
        Auth.processBussinessManagerAuth(req,res,function() {
            var advertInfo = {};

            advertInfo["sTitle"] = req.body.advertTitle;
            advertInfo["sDisplayType"] = req.body.advertShowType;
            advertInfo["nAdvertPrice"] = req.body.advertPrice;
            advertInfo["nStock"] = req.body.stock;
            advertInfo["nDayStock"] = req.body.dayStock;
            advertInfo["sHref"] = req.body.href;
            advertInfo["nMaterialId"] = req.body.materialId;

            DBManager.getAdvertInfoModel().findOneAndUpdate({nAdvertId:req.body.advertId},advertInfo,function(err){
                if(err){
                    console.log(err);
                    return res.send({code:RESULT_CODE_DBERROR,info:"数据库异常"});
                } else {
                    console.log("update success.");
                    return res.send({code:RESULT_CODE_SUCCESS,info:"操作成功!"});
                }

            })
        });
    }else{
        switch (req.params.option){
            case "lockAdvert":
                processLockAdvert(req,res,next);
                break;
            default :
                next();
                break;
        }
    }

    function processLockAdvert(req,res,next){
        Auth.processBussinessManagerAuth(req,res,function(){
           DBManager.getUserModel().findOneAndUpdate({_id:req.body.advertId},{sAdvertState:ADVERTSTATE_LOCK},function(err){
               if (err ) {
                   return res.send({code:RESULT_CODE_DBERROR,info:"数据库异常"});
               } else {
                   return res.send({code:RESULT_CODE_SUCCESS,info:"操作成功!"});
               }
           })
        });
    }
});

module.exports = router;