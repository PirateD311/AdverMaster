/**
 * Created by liuxun on 16/11/21.
 */
var router = require("express").Router();
var MaterialMode = require('../../lib/model/MaterialMode');

router.post('/:option?',function(req,res,next){

    console.log(req);
    switch (req.params.option)
    {
        case "qryMaterial":
            console.log("qryMaterial");
            MaterialMode.qryMaterial(req,function(err,result){
                if(err){
                    console.log("send err");
                    return res.send({code:RESULT_CODE_DBERROR,info:JSON.stringify(err)});
                }else{
                    console.log("send success.Data:");
                    console.log(result);
                    return res.send(result);
                }
            });
            break;
        case "uploadImg":
            try{
                logger.info("Before Throw Exception.");
                ExceptionTest();
                throw TypeError;
                logger.info("After Throw Exception.");
            }catch(e){
                logger.warn(e);
                return res.send("抛异常测试");
            }
            //MaterialMode
        default :
            next();
    }
});

function ExceptionTest(req,next){
    logger.info("Before Throw Exception.");
    throw TypeError;
    logger.info("DDDDD");
}

module.exports = router;