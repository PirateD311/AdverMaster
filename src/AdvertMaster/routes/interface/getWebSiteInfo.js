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
            "sOwnerUserName":"null",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.xxx.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nCPA":0,
            "nCPC":0,
            "nCPM":0
        }
    ];
    resultJson.tableStyle = {"tableTitle":"默认表格名","colTitle":"日期,网站主,媒介成员,CPA,富媒体,CPC,CPM,网站IP","tableCategory":"normal"};
    if(req.params.option){
        console.log("Begin check wzzbmp post interface table.");
        switch (req.params.option){
            case "wzzApprove":
                return res.send(dbHandle.qryAllWzz());
                break;
            case "xx":
                break;
            case "verifyWebApplication":
                console.log("verifyWebApplication");
                resultJson.tableStyle.tableTitle = "网站主审核";
                resultJson.tableStyle.tableCategory = 2;
                resultJson.tableStyle.colTitle = "日期,网站主,媒介成员,CPA,富媒体,CPC,CPM,网站IP";
                resultJson.tableStyle.colKey = ["sWebRegisterDate","sOwnerUserName","sMeijie","nCPA","nFumeiti","nCPC","nCPM","sWebIp"];
                return res.send(resultJson);
                break;
            default :
                resultJson.code = 0;
                resultJson.tableStyle = {};
                resultJson.data = {};
                return res.send(resultJson);

        }
    }else{
        res.send(resultJson);
        //返回所有网站信息
    }

});


module.exports = router;