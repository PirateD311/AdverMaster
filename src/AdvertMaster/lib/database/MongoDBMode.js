/**
 * Created by liuxun on 16/11/8.
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const Util = require('../myutil');
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
autoIncrement.initialize(mongoose.connection);
var ObjectId = Schema.ObjectId;
/*用户信息
* */
var User = mongoose.model('User',new Schema({
    //user集合基础字段
    nId:{type:Number,index:true},
    sUserName:{type:String,unique:true},
    sPassword:{type:String,default:"123456"},
    sEmail:{type:String,default:""},
    sContact:{type:String,default:""},
    sUserPhone:{type:String,default:""},
    sUserQQ:{type:String,default:""},
    nBalance:{type:Number,default:0},
    sUserType:{type:String,default:USERTYPE_NORMAL,enum: [USERTYPE_NORMAL, USERTYPE_ADVERTISER,USERTYPE_BUSINESS_MASTER,USERTYPE_SITE_MASTER,USERTYPE_GOD]},
    sUserState:{type:String,default:USERSTATE_UNACTIVE,enum: [USERSTATE_UNACTIVE,USERSTATE_NORMAL, USERSTATE_LOCK]},
    sSignUpDate:{type:String,default:new Date().toLocaleString()},
    //统计用字段
    sSignUpIp:{type:String},
    aLoginDate:[String],
    aLoginIp:[String]
}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'User',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

/*站点信息
* */
var WebSite = mongoose.model('WebSite',new Schema({
    nId:{type:Number},
    sName:{type:String,default:""},
    nOwnerUid:{type:Number,require:true},
    sOwnerName:{type:String,default:""},
    sWebIp:{type:String,default:""},
    sWebDomain:{type:String,default:""},
    sWebRegisterDate:{type:String,default:new Date().toLocaleString()},
    sWebState:{type:String,default:CONST.SITE_STATE_UNACTIVE,enum:[CONST.SITE_STATE_NORMAL,CONST.SITE_STATE_LOCK,CONST.SITE_STATE_UNACTIVE]},
    sWebCategory:{type:String,default:"未知分类"}

}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'WebSite',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

//var AdvertFlowStat = mongoose.model('AdvertFlowStat',new Schema({
//    sSiteIp:{type:String},
//    sRemoteIp:{type:String},
//    nAdvertId:{type:Number},
//    nCPC:{type:Number,default:0},
//    nCPM:{type:Number,default:0},
//    nCPV:{type:Number,default:0},
//    nCPA:{type:Number,default:0}
//}));

/*流量详细记录
* */
var FlowDetailRecord = mongoose.model('FlowDetailRecord',new Schema({
    nId:{type:Number},
    nSiteId:{type:Number},
    sSiteIp:{type:String},
    sSiteDomain:{type:String},

    sRemoteIp:{type:String},
    nAdvertId:{type:Number},
    sAdvertName:{type:String},
    advertDoc:{},

    sStatType:{type:String},//cpc,cpm,cpv
    sDate:{type:String,default:new Date().toLocaleString()}

}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'FlowDetailRecord',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

/*广告信息
* */
var AdvertInfo = mongoose.model('AdvertInfo',new Schema({
    //广告基本信息
    nId:{type:Number},
    nOwnerUid:{type:Number,require:true},
    sOwnerName:{type:String,require:true,default:""},
    sName:{type:String,default:""},
    sDescription:{type:String,default:""},
    sHref:{type:String,default:""},
    sAdvertState:{type:String,default:ADVERTSTATE_NORMAL},
    nCreateUid:{type:Number,default:0},
    sCreateTime:{type:String,default:new Date().toLocaleString()},
    sUpdateTime:{type:String,default:""},

    //展示相关，类型尺寸
    sDisplayType:{type:String,default:"",enum:[ADVERTTYPE_FMT,ADVERTTYPE_TC]},
    sHeight:{type:String,default:""},
    sWidth:{type:String,default:""},
    sSize:{type:String,default:""},
    sMaterialSrc:{type:String,default:""},
    nMaterialId:{type:Number,default:0},

    //计费相关，计费方式，价格(元/1000ip)
    sChargeType:{type:String,default:"",enum:[ADVERTCHARGETYPE_CLICK,ADVERTCHARGETYPE_VIEW]},
    nAdvertPrice:{type:Number,default:0},
    nSitePrice:{type:Number,default:0},

    //库存、计量相关
    nStock:{type:Number,default:0},
    nMaxCount:{type:Number,default:0},
    nDayStock:{type:Number,default:0},
    nMaxDayCount:{type:Number,default:0},

    //展示时段、ip控制的额外筛选
    sValidTime_Begin:{type:String},
    sValidTime_End:{type:String},

}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'AdvertInfo',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

var Material = mongoose.model('Material',new Schema({
    nId:{type:Number,unique:true,},
    sSrc:{type:String},
    sType:{type:String},
    sCategory:{type:String},
    nSize:{type:Number},
    sUploadDate:{type:String,default:new Date().toLocaleString()}
}).plugin(autoIncrement.plugin, {               //自增ID配置
    model: 'Material',
    field: 'nId',
    startAt: 1,
    incrementBy: 1
}));

/* 广告的每日报表
* */
var AdvertDailyStatReport = mongoose.model('AdvertReport',new Schema({
    //基本数据
    nId:{type:Number,unique:true,index:true},
    sDate:{type:String,require:true},
    sCategory:{type:String},

    nOwnerUid:{type:Number,require:true},
    sOwnerName:String,
    nAdvertId:{type:Number,require:true},
    sAdvertName:{type:String},
    aSiteId:[Number],

    sChargeType:{type:String,require:true},
    sDisplayType:{type:String,require:true},
    nAdvertPrice:{type:Number,require:true},
    //nSitePrice:{type:Number},
    nDayCost:{type:Number,require:true},//今日消耗的量
    nMaxDayCount:{type:Number,require:true},//最大量
    nCost:{type:Number,require:true},//总消耗
    nMaxCount:{type:Number,require:true},
    nMoney:{type:Number,require:true},//今日消耗的金额
    aFlowStatDetail:[]
}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'AdvertReport',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

/*站点的每日报表
* */
var SiteDailyReport = mongoose.model('SiteReport',new Schema({
    //基本信息
    nId:{type:Number,unique:true,index:true},
    sDate:{type:String,require:true},
    sCategory:{type:String},

    sOwnerName:String,
    nOwnerUid:{type:Number,require:true},
    nSiteId:{type:Number,require:true},
    sSiteDomain:String,
    sSiteIp:String,

    aAdvert:[],
    nMoney:{type:Number,require:true},
    nCount:{type:Number,require:true},


    aFlowStatDetail:[]

}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'SiteReport',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));

/*广告主充值账单
*
* */

/*站长打款账单
* */
var Bill = mongoose.model('Bill',new Schema({
    //基本信息
    nId:Number,
    sDate:String,
    sClass:String,
    sFrom:String,
    sTo:String,
    nMoney:Number,
    sPayWay:String,
    sState:String,
}).plugin(autoIncrement.plugin, {               //自增ID配置
        model: 'Bill',
        field: 'nId',
        startAt: 1,
        incrementBy: 1
    }));




module.exports.User = User;
module.exports.WebSite = WebSite;
//module.exports.AdvertFlowStat = AdvertFlowStat;
module.exports.AdvertInfo = AdvertInfo;
module.exports.Material = Material;
module.exports.FlowDetailRecord = FlowDetailRecord;
module.exports.AdvertDailyStatReport = AdvertDailyStatReport;
module.exports.Bill = Bill;

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