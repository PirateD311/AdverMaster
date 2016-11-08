/**
 * Created by liuxun on 16/11/8.
 */
const express = require('express');
const router = express.Router();
const DBManager = require('../lib/database/MongoDBManager.js').DBManager;

router.post('/',function(req,res,next){
    var LoginUserInfo = {
        sUserName:req.body.username,
        sPassword:req.body.password,
        sEmail:req.body.email,
        sUserPhone:req.body.phone,
        sUserQQ:req.body.qq
    };
    console.log(LoginUserInfo);
    DBManager.addUser(LoginUserInfo,function(err,doc){
        if(err){
            return res.send("注册失败！用户已存在");
        }
        req.session.logged_in = true;
        return res.render("index",{logged_in:true});
    });
})

module.exports = router;