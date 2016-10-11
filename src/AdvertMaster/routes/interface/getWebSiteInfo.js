/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
var dbHandle = {
    qryAllWzz :function(){
        var data = [
        {
            "sOwnerUserName":"liuxun",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.rrrr58.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nWebCategory":0,
            "sWebOwnerQQ":"851652491",
            "sWebOwnerPhone":"13101891378"
        },
        {
            "sOwnerUserName":"liuxun",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.rrrr58.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nWebCategory":0,
            "sWebOwnerQQ":"851652491",
            "sWebOwnerPhone":"13101891378"
        }]

        return {"code":1,"data":data};
    }
};

router.post('/:option?',function(req,res,next){
    console.log("Post Option is %s",req.params.option);
    //Post请求Url检查.

    var resultJson = {code:0,data:{}};
    resultJson.code = 1;
    resultJson.data =[
        {
            "sOwnerUserName":"liuxun",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.rrrr58.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nCPA":0,
            "nCPC":0,
            "nCPM":0
        },
        {
            "sOwnerUserName":"liuxun2",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.rrrr58.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nCPA":0,
            "nCPC":0,
            "nCPM":0
        }
    ];

    if(req.params.option){
        console.log("Begin check wzzbmp post interface table.");
        switch (req.params.option){
            case "wzzApprove":
                return res.send(dbHandle.qryAllWzz());
                break;
            case "xx":
                break;
            default :
                return res.send(resultJson);

        }
    }else{
        res.send(resultJson);
        //返回所有网站信息
    }





});


module.exports = router;