/**
 * Created by liuxun on 16/11/12.
 */
var router = require('express').Router();
var Auth = require('../../lib/middleware/authority/AuthrityManager');
var DBManager = require('../../lib/database/MongoDBManager').DBManager;

router.post('/:option?',function(req,res,next){
    var option = req.params.option;
    console.log("%s ModifyUser Auth Ok.",option);
    switch (option)
    {
      case "upToBusinessManager":
          processUpToBusinessManager(req,res,next);
          break;
      case "activeUser":
          processActiveUser(req,res,next);
          break;
      case "lockUser":
          processLockUser(req,res,next);
          break;
      case "getUserInfo":
            processGetAdvertor(req,res,next);
            break;
      default :
            return {code:RESULT_CODE_NOTFOUND,info:"Route not found."};
    };
});

function processUpToBusinessManager(req,res,next){
    console.log("do upToBusinessManager,user_name is %s",req.body.user_name);
    Auth.processGodAuth(req,res,function(){
        DBManager.getUserModel().findOneAndUpdate({sUserName:req.body.user_name},{$set:{sUserType:USERTYPE_BUSINESS_MASTER}},function(err){
            if(err){
                console.log(err);
                return res.send({code:RESULT_CODE_DBERROR,info:err});
            }else{
                console.log("upToBusinessManager success.");
                return res.send({code:RESULT_CODE_SUCCESS,info:"Option Success!"});
            }
        });
    });
}
function processActiveUser(req,res,next){
    Auth.processBussinessManagerAuth(req,res,function(){
        DBManager.getUserModel().findOneAndUpdate({sUserName:req.body.user_name},{sUserState:USERSTATE_NORMAL},function(err){
            if(err){
                console.log(err);
                return res.send({code:RESULT_CODE_DBERROR,info:err});
            }else{
                console.log("activeUser success.");
                return res.send({code:RESULT_CODE_SUCCESS,info:"Option Success!"});
            }
        });
    });
}
function processLockUser(req,res,next){
    Auth.processBussinessManagerAuth(req,res,function(){
        DBManager.getUserModel().findOneAndUpdate({sUserName:req.body.user_name},{sUserState:USERSTATE_LOCK},function(err){
            if(err){
                console.log(err);
                return res.send({code:RESULT_CODE_DBERROR,info:err});
            }else{
                console.log("activeUser success.");
                return res.send({code:RESULT_CODE_SUCCESS,info:"Option Success!"});
            }
        });
    });
}

function processGetAdvertor(req,res,next){
    Auth.processBussinessManagerAuth(req,res,function(){
        var query = {};
        if(req.body.sUserType)query['sUserType'] = req.body.sUserType;
        if(req.body.sUserState)query['sUserState'] = req.body.sUserState;
        //if(req.body.sUserType)query['sUserType'] = req.body.sUserType;
        DBManager.getUserModel().findOne(query,function(err,doc){
            if(err){
                console.log(err);
                return res.send({code:RESULT_CODE_DBERROR,info:err});
            }else{
                console.log("activeUser success.");
                return res.send({code:RESULT_CODE_SUCCESS,data:doc});
            }
        });
    });
}

module.exports = router;