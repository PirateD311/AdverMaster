/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
const DBManager = require("../../lib/database/MongoDBManager").DBManager;
const Util = require("../../lib/myutil");


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
    resultJson.tableStyle = {"tableTitle":"默认表格名","colTitle":"日期,网站主,媒介成员,CPA,富媒体,CPC,CPM,网站IP","tableCategory":CONST.TABLE_CATEGORY_NORMAL};

    if(req.params.option){
        console.log("Begin check wzzbmp post interface table.");
        switch (req.params.option){
            case "wzzApprove":
                return res.send(resultJson);
                break;
            case "xx":
                break;
            case "verifyWebApplication":
                console.log("verifyWebApplication");
                DBManager.getWebFlowStatModel().find({sWebState:CONST.SITE_STATE_UNACTIVE},function(err,doc){
                    if(err){
                        resultJson.code = 2;
                        throw err;
                        return res.send(resultJson);
                    }else{
                        for(var i in doc){
                            DBManager.getUserModel().findOne({sUserName:doc[i].sOwnerUserName},function(err,doc2){
                                if(!err&&doc2){
                                    console.log(doc2);
                                    doc[i]["sWebOwnerPhone"] = doc2.sUserPhone;
                                    doc[i].sUserQQ = doc2.sUserQQ;
                                    console.log(doc[i].sWebOwnerPhone);
                                    console.log(doc[i].sUserQQ);
                                    console.log(doc[i]);
                                }
                            });
                        }
                        resultJson.tableStyle.tableTitle = "网站主审核";
                        resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
                        resultJson.tableStyle.colTitle = "申请日期,网站主,IP,域名,许可证,联系电话,审核状态";
                        resultJson.tableStyle.colKey = ["sWebRegisterDate","sOwnerUserName","sWebIp","sWebDomain","sWebXK","sWebOwnerPhone","sWebState"];
                        resultJson.data = doc;
                        return res.send(resultJson);
                    }
                })
                break;
            case "qryAllFlowStat":
                DBManager.getWebFlowStatModel().find(function(err,doc){
                    if(err){
                        console.log(err);
                        throw err;
                        resultJson.code = 2;
                        return res.send(resultJson);
                    }
                    resultJson.tableStyle.tableTitle = "全部流量统计";
                    resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_NORMAL;
                    resultJson.tableStyle.colTitle = "网站主,IP,域名,CPC,CPA,CPM,网站状态";
                    resultJson.tableStyle.colKey = ["sOwnerUserName","sWebIp","sWebDomain","nCPC","nCPA","nCPM","sWebState"];
                    resultJson.data = doc;
                    return res.send(resultJson);
                })
                break;
            case "acceptApply":
                console.log("acceptApply");
                DBManager.getWebFlowStatModel().findOneAndUpdate({sWebIp:req.body.web_ip},{sWebState:CONST.SITE_STATE_NORMAL},function(err){
                    if(err){
                        return res.send("编辑失败");
                    }
                    console.log("编辑ip:%s 成功",req.body.web_ip);
                    return res.send("编辑成功");
                });
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