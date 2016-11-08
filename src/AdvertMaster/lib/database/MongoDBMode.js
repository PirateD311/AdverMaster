/**
 * Created by liuxun on 16/11/8.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserBase = mongoose.model('UserBase',new Schema({
    sUserName:{type:String,unique:true,index:true},
    sPassword:String,
    sEmail:{type:String,unique:true},
    sUserPhone:{type:String,unique:true},
    sUserQQ:{type:String,unique:true},
}));

var WebFlowStat = mongoose.model('WebFlowStat',new Schema({
    sOwnerUserName:{type:String,index:true},
    sWebIp:{type:String,index:true,unique:true},
    sWebDomain:{type:String,index:true,unique:true},
    sWebRegisterDate:String,
    nWebState:Number,
    nWebCategory:Number,
    nCPA:Number,
    nCPC:Number,
    nCPM:Number
}));

module.exports.WebFlowStat = WebFlowStat;
module.exports.UserBase = UserBase;
/*
{
    "sOwnerUserName":"liuxun",
    "sWebIp":"10.137.27.155",
    "sWebDomain":"www.rrrr58.com",
    "sWebRegisterDate":"2012/12/21",
    "nWebState":"1",
    "nCPA":0,
    "nCPC":0,
    "nCPM":0
}
    */