/**
 * Created by liuxun on 16/11/7.
 */
const express = require("express");
const mongoose = require("mongoose");
const dbMode = require("./MongoDBMode.js");
const logger = require("../myutil").getLogger;

mongoose.connect('mongodb://localhost/advert',function(){
    console.log('\033[96m+\033[39m connected to mongodb');
});

const DBManager = function(){
    var User = mongoose.model("User");
    var WebSite = mongoose.model("WebSite");
    var AdvertInfo = mongoose.model("AdvertInfo");
   // var AdvertFlowStat = mongoose.model("AdvertFlowStat");
    var Material = mongoose.model("Material");
    var FlowDetailRecord = mongoose.model("FlowDetailRecord");
    var AdvertDailyStatReport = mongoose.model("AdvertReport");
    var SiteDailyReport = mongoose.model("SiteReport");
    var Bill = mongoose.model('Bill');
    /*用户模型
    * */
    this.getUserModel = function(){
        return User;
    };
    this.addUser = function(user,callback){
        var user = new User(user);
        user.save(function(err){
            if(err){
                console.log("addUser fail:%s",err);
                return callback(err,null);
            }
            console.log("addUser Success");
            return callback(null,user);
        });
    }
    
    this.findUser = function(user,callback){
        User.findOne(user,function(err,doc){
            if(err){
                console.log("findUser err:%s",err);
                return callback(err,null);
            }
            console.log("find %s ,result is %s",user,doc);
            return callback(null,doc);
        });
    }

    /*流量统计模型
    * */
    this.getWebSiteModel = function(){
        return WebSite;
    }
    this.addWebSite = function(webSite,callback){
        var webSite = new WebSite(webSite);

        webSite.save(function(err){
            if(err){
                console.log("addWebSite fail:"+err);
                return callback(err,null);
            }
            console.log("addWebSite Success");
            return callback(err,webSite);
        });

    }

    /*广告信息
    *
    * */
    this.getAdvertInfoModel = function(){
        return AdvertInfo;
    }
    this.addAdvertInfoModel = function(advertInfo,callback){
        var advertInfo = new AdvertInfo(advertInfo);
        advertInfo.save(function(err){
            if(err){
                console.log("addWebSite fail:"+err);
                return callback(err,null);
            }
            console.log("addWebSite Success");
            return callback(null,advertInfo);
        });
    }
    ////流量统计   旧版流量统计，废弃
    //this.addAdvertFlowStat = function(advertFlowStat,callback){
    //    new AdvertFlowStat(advertFlowStat).save(function(err){
    //        if(err){
    //            console.log("addAdvertFlowStat fail:"+err);
    //            return callback(err,null);
    //        }
    //        console.log("addAdvertFlowStat Success");
    //        return callback(null,advertFlowStat);
    //    });
    //}
    //this.getAdvertFlowStatMode = function(){
    //    return AdvertFlowStat;
    //}
    //广告素材
    this.addMaterial = function(material,callback){
        material = new Material(material)
        material.save(function(err){
           if(err){
               logger.error("addMaterial failed.%s",JSON.stringify(material));
               return callback(err,null);
           }
            logger.info("addMaterial success.");
            return callback(null,material);
        });
    }
    this.getMaterial = function(){
        return Material;
    }

    /*流量详细记录
    * */
    this.addFlowDetailRecord = function(record,next){
        var record = new FlowDetailRecord(record)
        record.save(function(err){
            if(err){
                logger.error("addFlowDetailRecord failed.%s",JSON.stringify(record));
                return next(err,null);
            }
            logger.info("addFlowDetailRecord success.");
            return next(null,record);
        });
    }
    this.getFlowDetailRecord = function(){
        return FlowDetailRecord;
    }
    //广告报表
    this.addAdvertDailyStatReport = function(report,next){
        var report = new AdvertDailyStatReport(report);
        report.save(function(err){
            if(err)return next(err);
            logger.info("addAdvertDailyStatReport success.");
            return next(null,report);
        });
    }
    this.getAdvertDailyStatReport = function(){
        return AdvertDailyStatReport;
    }
    //站点报表
    this.addSiteDailyStatReport = function(report,next){
        var report = new SiteDailyReport(report);
        report.save(function(err){
            if(err)return next(err);
            logger.info('addSiteDailyStatReport success.');
            logger.info(report);
            return next(null,report);
        })
    }
    this.getSiteDailyStatReport = function(){
        return SiteDailyReport;
    }

    this.getBillModel = function(){
        return Bill;
    }
};

//Test
var DB = new DBManager()
/*
DB.addUser({sUserName:"gge",sPassword:"ee",sEmail:"qq"},function(){

});
DB.findUser({sUserName:"gg"},function(){

});
*/
exports.DBManager = DB;