/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
//const logger = require("")
router.get('/',function(req,res,next){
    //鉴权begin
    if(!req.session.logged_in){
        //res.render("Advert_BMP_index",{logged_in:true,logged_username:"测试"});
        res.send("用户未登录，请登陆后访问"+'<a href="/">登录</a>');
    }else{
        res.render("Advert_BMP_index",{logged_in:true,logged_username:req.session.logged_username});
    }

});
router.post('/',function(req,res,next){
    //鉴权begin
    if(!req.session.logged_in){
        //res.render("Advert_BMP_index",{logged_in:true,logged_username:"测试"});
        res.send("用户未登录，请登陆后访问"+'<a href="/">登录</a>');
    }else{
        res.render("Advert_BMP_index",{logged_in:true,logged_username:req.session.logged_username});
    }

});
/*
* 1.查询所有网站统计信息:all
* 2.网站主审核：
* 3.所有网站管理：
* 4.会员管理：
*
* */


module.exports = router;