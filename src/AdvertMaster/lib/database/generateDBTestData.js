/**
 * Created by liuxun on 16/12/1.
 */

var Util = require('../myutil');
var DBManager = require('../database/MongoDBManager').DBManager;
var UserModel = require('../model/UserModel');
var SiteModel = require('../model/SiteModel');
var Promise = require('bluebird');

/*初始化数据库数据
* */
var AdminUser = {
    sUserName:"liuxun",
    sPassword:"liuxun",
    sEmail:"851652491@qq.com",
    sUserPhone:"12345678",
    sUserType:USERTYPE_BUSINESS_MASTER,
    sUserState:USERSTATE_NORMAL
};
var AdvertiserUser = {
    sUserName:"广告主1",
    sPassword:"123456",
    sEmail:"851652491@qq.com",
    sUserPhone:"12345679",
    sUserType:USERTYPE_ADVERTISER,
    sUserState:USERSTATE_NORMAL
};
var SiteMaster = {
    sUserName:"站长1",
    sPassword:"123456",
    sEmail:"85165d491@qq.com",
    sUserPhone:"12345670",
    sUserType:USERTYPE_SITE_MASTER,
    sUserState:USERSTATE_NORMAL
};


DBManager.getUserModel().
    remove().
    then(function(){
        logger.debug("User表已清空");

        UserModel.createUser(AdminUser);
        UserModel.createUser(AdvertiserUser);
        UserModel.createUser(SiteMaster);

    });


var Site = {
    'sName':"本机",
    'nOwnerUid':1,
    "sOwnerName" : "站长1",
    "sWebIp" : "123.206.227.204",
    "sWebDomain" : "www.168lm.cn",
    "sWebCategory" : "新闻",
    "sWebState" : "正常"
};
DBManager.getWebSiteModel().remove();
SiteModel.createSite(Site).
    then(function(site){

    }).
    catch(function(err){
        logger.warn(err);
    });