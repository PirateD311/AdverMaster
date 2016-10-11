/**
 * Created by liuxun on 16/9/7.
 */
var express = require('express');
var router = express.Router();
var logger = require("../lib/myutil.js").log4js.getLogger();

router.post('/',function(req,res,next){
    console.log("username:%s,password:%s",req.body.username,req.body.password);
    if(req.session.logged_in){
        return res.send("已登录");
    }
    if(req.body.username == "liuxun" && req.body.password == "liuxun"){
        req.session.logged_in = true;
        return res.render("index",{logged_in:true});
    }else{
        return res.send("登录失败");
    }
    logger.debug("go Next");
    next();

});
router.get('/',function(req,res,next){
    if(req.session.logged_in){
        return res.send("已登录");
    }
    if(req.body.username == "liuxun" && req.body.password == "liuxun"){
        req.session.logged_in = true;
        return res.send("登录成功");
    }else{
        return res.send("登录失败");
    }
    logger.debug("go Next");
    next();

});
console.log("Login....")
module.exports = router;