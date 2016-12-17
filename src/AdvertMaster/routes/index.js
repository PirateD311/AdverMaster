var express = require('express');
var router = express.Router();
var Util = require('../lib/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.warn("是否登录：%b",Util.isLogin(req));
  logger.debug(req.session);
  if(Util.isLogin(req)&&req.session.logged_rpg==USERTYPE_BUSINESS_MASTER){
    res.render('index', { title: 'Express' ,logged_in:true,logged_username:req.session.logged_username});
  }else{
    res.render('V2/index/index', { title: 'Express' ,logged_in:false,logged_username:""});
  }

});

module.exports = router;
