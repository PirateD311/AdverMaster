/**
 * Created by liuxun on 16/11/30.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');

function createUser(data)
{
    return new Promise(function(resolve,reject){
        var user = {};
        if(!Util.field(["sUserName",'sPassword','sUserType'],data))
            next('请求参数不合法');
        if(!data['sUserState'])data['sUserState'] = USERSTATE_UNACTIVE;
        DBManager.getUserModel().
            create(data).
            then(function(doc)
            {
                logger.debug(doc);
                resolve(doc);
            }).
            catch(function(err)
            {
                logger.warn(err);
                reject(err);
            });
    });
}

module.exports.createUser = createUser;

function getUser(data)
{
    return new Promise((resolve,reject)=>
    {
        var query = Util.filter(['sUserName','sUserQQ','sUserType','sUserState'],data);
        if(!query.sUserType)query.sUserType = { $in: [USERTYPE_ADVERTISER, USERTYPE_SITE_MASTER] };
        else if(query.sUserType == USERTYPE_BUSINESS_MASTER)reject('无权查看管理员账户')
        //logger.info('query is :\n %s',JSON.stringify(query));
        DBManager.getUserModel().find(query||null).then(users=>
        {
            logger.info(users);
            resolve(users)
        }).catch(err=>reject(err));
    });
}
module.exports.getUser = getUser;

function lockUser(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getUserModel()
            .findOneAndUpdate({'nId':data.nId},{sUserState:USERSTATE_LOCK})
            .then(res=>{
                if(res)resolve(res)
                else reject('用户未找到');
            })
            .catch(err=>reject(err))
    });
}

function activeUser(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!Util.field(['nId'],data))
            reject("参数不合法");
        DBManager.getUserModel()
            .findOneAndUpdate({'nId':data.nId},{sUserState:USERSTATE_NORMAL})
            .then(res=>{
                if(res)resolve(res)
                else reject('用户未找到');
            })
            .catch(err=>reject(err))
    });
}
module.exports.lockUser = lockUser;
module.exports.activeUser = activeUser;