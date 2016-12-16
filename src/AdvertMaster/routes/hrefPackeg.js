/**
 * Created by liuxun on 16/12/13.
 */
var router = require('express').Router();

router.all('/',function(req,res,next){
    return res.render('hrefPackeg',{data:{}});
});

module.exports = router;













