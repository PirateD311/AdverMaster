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
    console.log(req.session.logged_username);
    DBManager.getUserModel().findOne({sUserName:req.session.logged_username,$or:[{sUserType:USERTYPE_NORMAL},{sUserType:USERTYPE_SITE_MASTER}]},function(err,doc){
        if(err||!doc){
            return res.render('redirect',{info:"用户未登录或无签约权限，请阅读签约指南",href:"/"});
        }
        var RegisterInfo = {
            sOwnerUserName:doc.sUserName,
            sWebIp:req.body.ip,
            sWebDomain:req.body.domain,
            sWebCategory:req.body.category
        };
        console.log(RegisterInfo);
        DBManager.addWebSite(RegisterInfo,function(err,doc){
            if(err){
                //return res.send("签约失败");
                return res.render('redirect',{info:"签约失败，请阅读签约指南",href:"/register"});
            }
            return res.render('redirect',{info:"签约成功",href:"/wzzbmp"});
        });
    });
});

router.get('/',function(req,res,next){
    if(req.session.logged_in){
        //return res.send("用户未登录！无法操作广告登记")
        return res.render("register");
    }else{
        return res.render('redirect',{info:"用户未登录！无法操作广告登记",href:"/"});
    }
});

module.exports = router;