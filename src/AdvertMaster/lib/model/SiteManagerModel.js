/**
 * Created by liuxun on 16/11/30.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');

/*查站点相关信息
 *post参数：
 * uid 必选
 * state 可选
 *
 *
 *
 *
 *
* */
function getSiteInfo(data){

        var query = {};
        //初管理员外，其余用户只能查自己的


        if(data['sOwnerUserName'])
            query['sOwnerUserName'] = data['sOwnerUserName'];

        if(data['sWebState'])
            query['sWebState'] = data['sWebState'];

        return DBManager.getWebSiteModel().find(query)


}
module.exports.getSiteInfo = getSiteInfo;

function getAdvert(data,next){
    require('./AdvertModel').qryAdvertInfo(data,next);
}
module.exports.getAdvert = getAdvert;

function getReport(data,next){

    var query = {};


    return DBManager.getSiteDailyStatReport().find(query)
        .then(reports=>{

        });
}

