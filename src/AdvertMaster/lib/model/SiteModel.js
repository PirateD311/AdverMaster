/**
 * Created by liuxun on 16/12/2.
 */
var DBManager = require('../database/MongoDBManager').DBManager;
var WebSiteModel = DBManager.getWebSiteModel();
var Util = require('../myutil');



function getSite(data)
{
    return new Promise((resolve,reject)=>
    {
        var screen = ['nId','sName','nOwnerUid','sOwnerName','sWebIp','sWebDomain','sWebState','sWebCategory'];
        var query = Util.filter(screen,data)||null;
        DBManager.getWebSiteModel().find(query).then(sites=>resolve(sites)).catch(err=>reject(err));
    });
}
module.exports.getSite = getSite;

function updateOneSiteById(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId','set'],data))reject('参数不合法');

        var query = Util.filter(['nId'],data);
        WebSiteModel.findOneAndUpdate(query,data.set)
        .then(site=>{
            if(site)resolve(site);
            reject('站点未找到');
        })
        .catch(err=>reject(err));
    })
}
module.exports.updateOneSiteById = updateOneSiteById;

//增
function createSite(data)
{
    return new Promise(function(resolve,reject){
        if(!Util.field(['sName','nOwnerUid','sOwnerName','sWebDomain'],data))
            reject("参数不合法");

        DBManager.getWebSiteModel().
            create(data).
            then(function(site){
                resolve(site);
            }).
            catch(function(err){
                reject(err);
            });
    });
}

//删

//改
function updateSite(data,next)
{
    if(!Util.field(['nId'],data))
        return next('参数不合法');

    DBManager.getWebSiteModel().findOneAndUpdate(
        {nId:data['nId']},
        data,
        function(err){
            if(err)return next(err);
            return next(null,data);
        }
    )
}

//查
function qrySiteInfo(data,next){
    var query = {};

    if(data['sOwnerUserName'])
        query['sOwnerUserName'] = data['sOwnerUserName'];

    if(data['sWebState'])
        query['sWebState'] = data['sWebState'];


    DBManager.getWebSiteModel().find(
        query,
        function(err,sites){
            if(err)return next(err);
            return next(null,sites);
        });
}


//public
module.exports.createSite = createSite;
module.exports.updateSite = updateSite;
module.exports.qrySiteInfo = qrySiteInfo;


