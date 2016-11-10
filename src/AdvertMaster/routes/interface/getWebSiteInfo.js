/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
const DBManager = require("../../lib/database/MongoDBManager").DBManager;
const Util = require("../../lib/myutil");


router.post('/:option?',function(req,res,next){
    console.log("Post Option is %s",req.params.option);
    //Post请求Url检查.

    var resultJson = {code:0,info:"",data:[],tableStyle:{tableTitle:"",tableCategory:"",colTitle:"",colKey:[]}};
    if(req.params.option){
        console.log("Begin check wzzbmp post interface table.");
        switch (req.params.option){
            case "wzzApprove":
                return res.send(resultJson);
                break;
            case "qryAllUser":
                DBManager.getUserModel().find(function(err,doc){
                    if(err){
                        console.log(err);
                        throw err;
                        resultJson.code = 2;
                        return resultJson;
                    }else{
                        resultJson.code = RESULT_CODE_SUCCESS;
                        resultJson.tableStyle.tableTitle = "所有会员";
                        resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_NORMAL;
                        resultJson.tableStyle.colTitle = "用户名,邮箱,联系电话,QQ,用户类型";
                        resultJson.tableStyle.colKey = ["sUserName","sEmail","sUserPhone","sUserQQ","sUserType"];
                        resultJson.data = doc;
                        return res.send(resultJson);
                    }
                });
                break;
            case "qryAllSiteInfo":
                processQrySiteInfo({},req,res);
                break;
            case "verifyWebApplication":
                console.log("verifyWebApplication");
                processQrySiteInfo({sWebState:CONST.SITE_STATE_UNACTIVE},req,res);
               break;
            case "qryAllFlowStat":
                DBManager.getWebFlowStatModel().find(function(err,doc){
                    if(err){
                        console.log(err);
                        throw err;
                        resultJson.code = 2;
                        return res.send(resultJson);
                    }
                    resultJson.code = RESULT_CODE_SUCCESS;
                    resultJson.tableStyle.tableTitle = "全部流量统计";
                    resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_NORMAL;
                    resultJson.tableStyle.colTitle = "网站主,IP,域名,CPC,CPA,CPM,网站状态";
                    resultJson.tableStyle.colKey = ["sOwnerUserName","sWebIp","sWebDomain","nCPC","nCPA","nCPM","sWebState"];
                    resultJson.data = doc;
                    return res.send(resultJson);
                })
                break;
            //站点管理相关接口
            case "activeSite"://审核通过
                console.log("activeSite");
                DBManager.getWebFlowStatModel().findOneAndUpdate({sWebIp:req.body.web_ip},{sWebState:CONST.SITE_STATE_NORMAL},function(err){
                    if(err){
                        resultJson.code = RESULT_CODE_DBERROR;
                        resultJson.info = err;
                        return res.send(resultJson);
                    }
                    resultJson.code = RESULT_CODE_SUCCESS;
                    resultJson.info = "激活成功";
                    return res.send(resultJson);
                });
                break;
            case "lockSite":
                DBManager.getWebFlowStatModel().findOneAndUpdate({sWebIp:req.body.web_ip},{sWebState:CONST.SITE_STATE_LOCK},function(err){
                    if(err){
                        resultJson.code = RESULT_CODE_DBERROR;
                        resultJson.info = err;
                        return res.send(resultJson);
                    }else{
                        resultJson.code = RESULT_CODE_SUCCESS;
                        resultJson.info = "锁定成功";
                        return res.send(resultJson);
                    }
                })
                break;
            default :
                resultJson.code = 0;
                resultJson.tableStyle = {};
                resultJson.data = {};
                return res.send(resultJson);

        }
    }else{
        return res.send(resultJson);
        //返回所有网站信息
    }

    function processQrySiteInfo(query,req,res){
        DBManager.getWebFlowStatModel().find(query,function(err,doc){
            if(err){
                resultJson.code = 2;
                throw err;
                return res.send(resultJson);
            }else{
                resultJson.code = RESULT_CODE_SUCCESS;
                resultJson.tableStyle.tableTitle = "网站主审核";
                resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
                resultJson.tableStyle.colTitle = "申请日期,网站主,IP,域名,许可证,联系电话,审核状态";
                resultJson.tableStyle.colKey = ["sWebRegisterDate","sOwnerUserName","sWebIp","sWebDomain","sWebXK","sWebOwnerPhone","sWebState"];
                getUserInfo(0);
                function getUserInfo(i){
                    if(i === doc.length){



                        return res.send(resultJson);
                    }else{
                        DBManager.getUserModel().findOne({sUserName:doc[i].sOwnerUserName},function(err,doc2){
                            if(!err&&doc2) {
                                var tmp = {};
                                resultJson.tableStyle.colKey.map(function(key){
                                    tmp[key] = doc[i][key];
                                });
                                tmp["sWebOwnerPhone"] = doc2.sUserPhone;
                                tmp["sUserQQ"] = doc2.sUserQQ;

                                resultJson.data.push(tmp);
                                getUserInfo(i+1);
                            }else{
                                resultJson.code = RESULT_CODE_DBERROR;
                                return res.send(resultJson);
                            }
                        });
                    }
                }
            }
        })
    }

});


module.exports = router;