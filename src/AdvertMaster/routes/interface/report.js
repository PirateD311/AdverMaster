/**
 * Created by liuxun on 16/11/26.
 */
var router = require('express').Router();
var Auth = require('../../lib/middleware/authority/AuthrityManager');
var ReportModel = require('../../lib/model/StatReportModel');
var Util = require('../../lib/myutil');

router.post('/:option?',function(req,res,next){
    switch (req.params.option)
    {
        //
        case "AdvertReport":
            Auth.processBussinessManagerAuth(req,res,
                function(){
                    ReportModel.qryAdvertiserReport(req.body,
                        function(err,result){
                            if(err)return next(err);
                            return res.send(result);
                        });
                });
            break;
        case "QryReport":
            Auth.processBussinessManagerAuth(req,res,
            function(){
                ReportModel.qryAdvertiserReport(req.body,
                    function(err,result){
                        if(err)return next(err);
                        return res.send(result);
                    });
            });
            break;
        case "":
            break;
        case "":
            break;
        default :
            next();
    }
});
module.exports = router;