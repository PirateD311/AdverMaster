var express = require('express');
var router = express.Router();
var logger = require("../lib/myutil.js").log4js.getLogger();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logged_in){
    res.render('index', { title: 'Express' ,logged_in:true,logged_username:req.session.logged_username});
  }else{
    res.render('index', { title: 'Express' ,logged_in:false,logged_username:""});
  }

});

module.exports = router;
