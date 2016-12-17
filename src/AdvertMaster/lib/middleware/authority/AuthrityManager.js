/**
 * Created by liuxun on 16/11/11.
 */
const DBManager = require("../../database/MongoDBManager").DBManager;
const Util = require('../../myutil');
//业务员鉴权
function processBusinessManagerAuth(req,res,next){
    console.log("processBusinessManagerAuth");
    if(!Util.isLogin(req))
    {
        //return res.send({code:RESULT_CODE_NOPERMISSION,info:"请登录"});
        return res.render('redirect',{info:"请登录！",href:'/'});
    }

    DBManager.getUserModel().findOne({$or:[{_id:req.session.logged_userid},{sUserName:req.session.logged_username}]},function(err,doc){
        if(err||!doc){
            throw err;
            return res.send({code:RESULT_CODE_DBERROR,info:err});
        }else{
            if(doc.sUserType == USERTYPE_BUSINESS_MASTER && doc.sUserState == USERSTATE_NORMAL){
                next();
            }else{
                return res.send({code:RESULT_CODE_NOPERMISSION,info:"User don't have Business Permission."});
            }
        }
    });
}
module.exports.processBussinessManagerAuth = processBusinessManagerAuth;

//神鉴权
function processGodAuth(req,res,next){
    DBManager.getUserModel().findOne({$or:[{_id:req.session.logged_userid},{sUserName:req.session.logged_username}]},function(err,doc){
        if(err||!doc){
            throw err;
            return res.send({code:RESULT_CODE_DBERROR,info:err});
        }else{
            if(doc.sUserType == USERTYPE_GOD && doc.sUserState == USERSTATE_NORMAL){
                next(req.session.logged_userid);
            }else{
                return res.send({code:RESULT_CODE_NOPERMISSION,info:"User don't have Business Permission."});
            }
        }
    });
}
module.exports.processGodAuth = processGodAuth;

//站点鉴权
function processSiteAuth(req,res,next){
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");

    //var sSiteName = req.body.hostname;
    //var nAdvertId = req.body.nAdvertId;
    console.log('processSiteAuth...');
    console.log(req.body);
    var query = {};
    query.sWebState = CONST.SITE_STATE_NORMAL;
    if(req.body.hostname.search('www.') == 0)query.sWebDomain = req.body.hostname
    else if(req.body.hostname.search('http://' == 0))query.sWebDomain = req.body.hostname.replace('http://','');
    else query.sWebIp = req.body.hostname;
    console.log(query);
    DBManager.getWebSiteModel().findOne(query,function(err,doc){
        if(err){
            return res.send({code:RESULT_CODE_DBERROR,info:err});
        }else{
            if(!doc){
                console.log("ip[%s] not found.",req.body.hostname);
                return res.send({code:RESULT_CODE_NOPERMISSION,info:"Your ip is not trusted "});
            }
            req.body.site = doc;
            next();
        }
    });
};
module.exports.processSiteAuth = processSiteAuth;

//广告主鉴权
function processAdvertiserAuth(req,res,next){
    if(CONFIG.DEBUG_MODE)return next();

    if(!Util.isLogin(req))
    {
        return res.render('redirect',{info:"请登录！",href:'/'});
    }

    if(req.session.logged_rpg == USERTYPE_ADVERTISER)
        next();
}
module.exports.processAdvertiserAuth = processAdvertiserAuth;
function processSiteManagerAuth(req,res,next)
{
    if(CONFIG.DEBUG_MODE)return next();
    if(!Util.isLogin(req))
    {
        return res.render('redirect',{info:"请登录！",href:'/'});
    }

    if(!req.session.logged_rpg == USERTYPE_SITE_MASTER)
        return res.send({code:RESULT_CODE_NOPERMISSION,info:"您不是网站主"});
    next();
}
module.exports.processSiteManagerAuth = processSiteManagerAuth;

