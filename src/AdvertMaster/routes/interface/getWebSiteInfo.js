/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
const DBManager = require("../../lib/database/MongoDBManager").DBManager;
const Util = require("../../lib/myutil");
const Auth = require("../../lib/middleware/authority/AuthrityManager");

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
            case "qryAllSiteManager":
                processQryUserInfo({sUserType:USERTYPE_SITE_MASTER},req,res);
                break;
            case "qryAllAdverter":
                processQryUserInfo({sUserType:USERTYPE_ADVERTISER},req,res);
                break;
            case "qryAllUnActiveSiteManager":
                processQryUserInfo({sUserType:USERTYPE_SITE_MASTER,sUserState:USERSTATE_UNACTIVE},req,res);
                break;
            case "qryAllUnActiveAdverter":
                processQryUserInfo({sUserType:USERTYPE_ADVERTISER,sUserState:USERSTATE_UNACTIVE},req,res);
                break;
            case "qryAllUser":
                processQryUserInfo({},req,res);
                break;
            case "qryAllSiteInfo":
                processQrySiteInfo({},req,res);
                break;
            case "verifyWebApplication":
                console.log("verifyWebApplication");
                processQrySiteInfo({sWebState:CONST.SITE_STATE_UNACTIVE},req,res);
               break;
            case "qryAllFlowStat":
                DBManager.getAdvertFlowStat().find(function(err,doc){
                    if(err){
                        console.log(err);
                        throw err;
                        resultJson.code = 2;
                        return res.send(resultJson);
                    }
                    resultJson.code = RESULT_CODE_SUCCESS;
                    resultJson.tableStyle.tableTitle = "全部流量统计";
                    resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_NORMAL;
                    resultJson.tableStyle.colTitle = "站点Ip,访客Ip,广告Id,CPC,CPM,CPV,CPA";
                    resultJson.tableStyle.colKey = ["sSiteIp","sRemoteIp","sAdvertId","nCPC","nCPM","nCPV","nCPA"];
                    resultJson.data = doc;
                    return res.send(resultJson);
                })
                break;
            //站点管理相关接口
            case "activeSite"://审核通过
                console.log("activeSite");
                Auth.processBussinessManagerAuth(req,res,function(){
                    DBManager.getWebSiteModel().findOneAndUpdate({sWebIp:req.body.web_ip},{sWebState:CONST.SITE_STATE_NORMAL},function(err){
                        if(err){
                            resultJson.code = RESULT_CODE_DBERROR;
                            resultJson.info = err;
                            return res.send(resultJson);
                        }
                        DBManager.getUserModel().findOneAndUpdate({sUserName:req.body.web_owner_name},{sUserType:USERTYPE_SITE_MASTER},function(err){
                            if(err){
                                resultJson.code = RESULT_CODE_DBERROR;
                                resultJson.info = err;
                                return res.send(resultJson);
                            }else{
                                resultJson.code = RESULT_CODE_SUCCESS;
                                resultJson.info = "激活成功";
                                return res.send(resultJson);
                            }
                        });
                    });
                });

                break;
            case "lockSite":
                Auth.processBussinessManagerAuth(req,res,function(){
                    DBManager.getWebSiteModel().findOneAndUpdate({sWebIp:req.body.web_ip},{sWebState:CONST.SITE_STATE_LOCK},function(err){
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
                });

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
        DBManager.getWebSiteModel().
            find(query).
            then(function(doc){
                console.log(doc);
                resultJson.code = RESULT_CODE_SUCCESS;
                resultJson.tableStyle.tableTitle = "网站主审核";
                resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
                resultJson.tableStyle.options = ["审批","锁定"];
                resultJson.tableStyle.colTitle = "申请日期,网站主,IP,域名,站点类型,QQ,联系电话,站点状态";
                resultJson.tableStyle.colKey = ["sWebRegisterDate","sOwnerName","sWebIp","sWebDomain","sWebCategory","sWebOwnerQQ","sWebOwnerPhone","sWebState"];
                getUserInfo(0);
                function getUserInfo(i){
                    if(i === doc.length){
                        return res.send(resultJson);
                    }else{
                        DBManager.getUserModel().findOne({sUserName:doc[i].sOwnerName},function(err,doc2){
                            if(!err&&doc2) {
                                var tmp = {};
                                resultJson.tableStyle.colKey.map(function(key){
                                    tmp[key] = doc[i][key];
                                });
                                tmp["sWebOwnerPhone"] = doc2.sUserPhone;
                                tmp["sWebOwnerQQ"] = doc2.sUserQQ;

                                resultJson.data.push(tmp);
                                getUserInfo(i+1);
                            }else{
                                var tmp = {};
                                resultJson.tableStyle.colKey.map(function(key){
                                    tmp[key] = doc[i][key];
                                });

                                resultJson.data.push(tmp);
                                getUserInfo(i+1);
                            }
                        });
                    }
                }
            }).
            catch(function(){
                resultJson.code = 2;
                return res.send(resultJson);
            });


    }

    function processQryUserInfo(query,req,res){
        DBManager.getUserModel().find({query},function(err,doc){
            if(err){
                console.log(err);
                throw err;
                resultJson.code = 2;
                return resultJson;
            }else{
                resultJson.code = RESULT_CODE_SUCCESS;
                resultJson.tableStyle.tableTitle = "所有会员";
                resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
                resultJson.tableStyle.options = ["审批会员","锁定会员"];
                resultJson.tableStyle.colTitle = "用户名,注册日期,邮箱,联系电话,QQ,用户类型,状态";
                resultJson.tableStyle.colKey = ["sUserName","sSignUpDate","sEmail","sUserPhone","sUserQQ","sUserType","sUserState"];

                resultJson.data = doc;
                return res.send(resultJson);
            }
        });
    }

});


module.exports = router;