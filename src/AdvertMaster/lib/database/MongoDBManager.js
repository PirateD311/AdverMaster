/**
 * Created by liuxun on 16/11/7.
 */
const express = require("express");
const mongoose = require("mongoose");
const dbMode = require("./MongoDBMode.js");

mongoose.connect('mongodb://localhost/advert',function(){
    console.log('\033[96m+\033[39m connected to mongodb');
});

const DBManager = function(){
    var User = mongoose.model("UserBase");
    var WebFlowStat = mongoose.model("WebFlowStat");
    /*用户模型
    * */
    this.getUserModel = function(){
        return User;
    };
    this.addUser = function(user,callback){
        new User(user).save(function(err){
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
    this.getWebFlowStatModel = function(){
        return WebFlowStat;
    }
    this.addWebFlowStat = function(webflow,callback){
        new WebFlowStat(webflow).save(function(err){
            if(err){
                console.log("addWebFlowStat fail:"+err);
                return callback(err,null);
            }
            console.log("addWebFlowStat Success");
            return callback(null,webflow);
        });
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