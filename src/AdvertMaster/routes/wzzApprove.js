/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
//const logger = require("")
router.get('/:type?',function(req,res,next){
   //鉴权
    console.log("type is %s",req.params.type);
    if(!req.session.logged_in){
        res.render('Advert_BMP_index', { title: 'Express' ,logged_in:true ,postUrl:"getWebSiteInfo"});
        //res.send("未登录");
    }else{
        res.render('Advert_BMP_index', { title: 'Express' ,logged_in:true ,postUrl:"getWebSiteInfo"});
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