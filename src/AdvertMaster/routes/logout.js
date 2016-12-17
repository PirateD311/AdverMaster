/**
 * Created by liuxun on 16/11/12.
 */
var Router = require('express').Router();
var Util = require('../lib/myutil');
Router.get('/',function(req,res,next){
    if(Util.isLogin(req)){
        console.log("[%s]登出.",req.session.logged_username);
        req.session.logged_in = false;
        req.session.logged_uid = -1;
        req.session.logged_username = "";
        req.session.logged_rpg = "";
        console.log(req.session);
    }
    res.redirect('/');
});

module.exports = Router;