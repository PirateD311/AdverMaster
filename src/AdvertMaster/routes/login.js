/**
 * Created by liuxun on 16/9/7.
 */
var express = require('express');
var router = express.Router();
var logger = require("../lib/myutil.js").log4js.getLogger();
var DBManager = require("../lib/database/MongoDBManager.js").DBManager;

router.post('/',function(req,res,next){
    console.log("username:%s,password:%s",req.body.username,req.body.password);
    if(req.session.logged_in){
        return res.send("已登录");
    }
    DBManager.getUserModel().findOne({sUserName:req.body.username,sPassword:req.body.password},function(err,doc){
        if(err){
            return next(err);
        }
        if(!doc){
            return res.send("用户未找到或密码错误");
        }else{
            req.session.logged_in = true;
            req.session.logged_userid = doc._id.toString();
            console.log("logged_userid:"+doc._id.toString());
            return res.render("index",{logged_in:true});
        }

    });

});

console.log("Login....")
module.exports = router;