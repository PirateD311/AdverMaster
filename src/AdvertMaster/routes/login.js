/**
 * Created by liuxun on 16/9/7.
 */
var express = require('express');
var router = express.Router();
var Util = require('../lib/myutil');
var DBManager = require("../lib/database/MongoDBManager.js").DBManager;

router.post('/',function(req,res,next){
    console.log("username:%s,password:%s",req.body.username,req.body.password);
    if(Util.isLogin(req)){
        req.session = null;
    }
    DBManager.getUserModel()
    .findOne({sUserName:req.body.username,sPassword:req.body.password})
    .then(user=>{
        if(user)
        {
            if(user.sUserState != USERSTATE_NORMAL)
                return res.send('用户未激活或被锁定，请联系业务员处理.');
            req.session.logged_in = true;
            req.session.logged_uid = user.nId;
            req.session.logged_username = user.sUserName;
            req.session.logged_rpg = user.sUserType;

            if(user.sUserType == USERTYPE_BUSINESS_MASTER)
                return res.redirect('/admin/index');
            else if(user.sUserType == USERTYPE_ADVERTISER)
                return res.redirect('/advertiser/index');
            else if(user.sUserType == USERTYPE_SITE_MASTER)
                return res.redirect('/siteManager/index');
        }
    })
    .catch(err=>res.send(err));


});

console.log("Login....")
module.exports = router;