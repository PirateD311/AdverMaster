/**
 * Created by liuxun on 16/11/30.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');

function getAdvert(data,next){
    var query = {};
    if(data['sOwnerName'])
        query['sOwnerName'] = data['sOwnerName'];
    if(data['sName'])
        query['sName'] = data['sName'];
    if(data['sDisplayType'])
        query['sDisplayType'] = data['sDisplayType'];

    DBManager.getAdvertInfoModel().find(
        query,
        function(err,adverts){
            if(err)return next(err);
            return next(null,adverts);
        }
    )
}
module.exports.getAdvert = getAdvert;

function getReport(data,next){
    var query = {};
    if(data['nAdvertId'])
        query['nAdvertId'] = data['nAdvertId'];

    if(data['sBeginDate'] && data['sEndDate'])
        query['sDate'] = {$gt:data['sBeginDate'],$lt:data['sEndDate']};

    if(data['sDate'])
        query['sDate'] = data['sDate'];

    DBManager.getAdvertDailyStatReport().find(
        query,
        function(err,reports){
            if(err)return next(err);
            return next(null,reports);
        }
    )
}
module.exports.getReport = getReport;
