/**
 * Created by liuxun on 16/11/8.
 */
/**
 * Created by liuxun on 16/11/8.
 */
const express = require('express');
const router = express.Router();
const DBManager = require('../lib/database/MongoDBManager.js').DBManager;

router.post('/',function(req,res,next){
    DBManager.getUserModel().findOne({_id:req.session.logged_userid},function(err,doc){
        if(err||!doc){
            return res.send("用户未登录或无签约权限。id:%s",req.session.logged_userid);
        }
        var RegisterInfo = {
            sOwnerUserName:doc.sUserName,
            sWebIp:req.body.ip,
            sWebDomain:req.body.domain,
            sWebRegisterDate:new Date().toDateString(),
            nWebState:0,
            nCPA:0,
            nCPC:0,
            nCPM:0
        };
        console.log(RegisterInfo);
        DBManager.addWebFlowStat(RegisterInfo,function(err,doc){
            if(err){
                return res.send("签约失败");
            }
            return res.send("签约成功");
        });
    });
});

router.get('/',function(req,res,next){
    if(req.session.logged_in){
        //return res.send("用户未登录！无法操作广告登记")
        return res.render("register");
    }else{
        //return res.send("用户未登录！无法操作广告登记")
        return res.render("register");
    }
});

module.exports = router;