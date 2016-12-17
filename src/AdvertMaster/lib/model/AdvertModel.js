/**
 * Created by liuxun on 16/11/22.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');

function createAdvert(data,next){
    if(Util.field(['sOwnerName','nOwnerUid','sName','sHref'],data))
        return next('参数有误');
}

function getAdvertInfo(data){
    return new Promise((resolve,reject)=>
    {
        var query = Util.filter(['nId','nOwnerUid','sOwnerName','sName','sAdvertState','sDisplayType','sChargeType','nStock','nDayStock'],data);
        DBManager.getAdvertInfoModel().find(query||null)
        .then(adverts=>resolve(adverts))
        .catch(err=>reject(err));
    });
}
module.exports.getAdvertInfo = getAdvertInfo;

function lockAdvert(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getAdvertInfoModel()
        .findOneAndUpdate({'nId':data.nId},{sAdvertState:ADVERTSTATE_LOCK})
        .then(res=>{
            if(res)resolve(res)
            else reject('广告未找到');
        })
        .catch(err=>reject(err))
    });
}
module.exports.lockAdvert = lockAdvert;

function activeAdvert(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getAdvertInfoModel()
        .findOneAndUpdate({'nId':data.nId},{sAdvertState:ADVERTSTATE_NORMAL})
        .then(res=>{
            if(res)resolve(res)
            else reject('广告未找到');
        })
        .catch(err=>reject(err))
    });
}
module.exports.activeAdvert = activeAdvert;

function qryAdvertInfo(data,next){
    var query = {};
    if(data['sOwnerName'])
        query['sOwnerName'] = data['sOwnerName'];
    if(data['sTitle'])
        query['sTitle'] = data['sTitle'];
    if(data['sDisplayType'])
        query['sDisplayType'] = data['sDisplayType'];
    if(data['sAdvertState'])
        query['sAdvertState'] = data['sAdvertState'];

    DBManager.getAdvertInfoModel().find(
        query,
        function(err,adverts){
            if(err)return next(err);
            return next(null,adverts);
        });

}
module.exports.qryAdvertInfo = qryAdvertInfo;