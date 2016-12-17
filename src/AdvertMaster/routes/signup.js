/**
 * Created by liuxun on 16/11/8.
 */
const express = require('express');
const router = express.Router();
const DBManager = require('../lib/database/MongoDBManager.js').DBManager;

router.post('/:type',function(req,res,next){

    var LoginUserInfo = {
        sUserName:req.body.username,
        sPassword:req.body.password,
        sEmail:req.body.email,
        sUserPhone:req.body.phone,
        sUserQQ:req.body.qq,
        sContact:req.body.contact,
    };
    if(req.params.type === "adverter"){
        LoginUserInfo["sUserType"] = USERTYPE_ADVERTISER;
    }else if(req.params.type === "sitemaster"){
        LoginUserInfo["sUserType"] = USERTYPE_SITE_MASTER;
        LoginUserInfo["sUserDomain"] = req.body.domain;
        LoginUserInfo["sUserSiteName"] = req.body.sitename;
    }else{
        return res.render('redirect',{info:"注册失败！用户类型错误",href:"/"});
    }
    console.log(LoginUserInfo);
    DBManager.addUser(LoginUserInfo,function(err,doc){
        if(err){
            return res.render('redirect',{info:"注册失败！用户已存在",href:"/"});
        }
        DBManager.getUserModel().findOne({sUserName:req.body.username},function(err,doc2){
            if(err||!doc2){
                return res.render('redirect',{info:"注册失败！用户已存在",href:"/"});
            }

            return res.render("redirect",{info:"注册成功，请联系客服进行审核！",href:"/"});
        });

    });
});

router.get("/:type",function(req,res,next){
    if(req.params.type === "adverter"){
        res.render('V2/signup/advertersignup',{});
    }
    if(req.params.type === "sitemaster"){
        res.render('V2/signup/sitemastersignup',{});
    }else{
        next();
    }
});

module.exports = router;