var express = require('express');
var router = express.Router();
var logger = require("../lib/myutil.js").log4js.getLogger();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logged_in){
    res.render('index', { title: 'Express' ,logged_in:true});
  }else{
    res.render('index', { title: 'Express' ,logged_in:false});
  }

});

module.exports = router;
