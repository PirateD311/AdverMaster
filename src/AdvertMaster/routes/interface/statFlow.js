/**
 * Created by liuxun on 16/11/9.
 */
var router = require("express").Router();
const DBManager = require("../../lib/database/MongoDBManager").DBManager;
const Util = require("../../lib/myutil");
const FlowStatManager = require("../../lib/flowstat/FlowStatManager").FlowStatManager;
var advertId = 0;
router.post('/',function(req,res,next){
    console.log("广告请求");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    var sVisitorIp = req.headers['x-real-ip']||req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var sHostName = req.body.hostname;

    //Check HostName
    DBManager.getWebFlowStatModel().findOne({"sWebIp":sHostName,sWebState:CONST.SITE_STATE_NORMAL},function(err,doc){
        if(err)throw err;
        if(!doc){
            console.log("Host:%s is not trust.",sHostName);
            return res.send({code:2,info:"Your are not trust."});
        }else{
            //返回广告内容
            var aAvertBox = [
                '<div id="Advert" style="position:fixed;right:0;bottom:0"><span id="AdvertClose" style="right: 0;position: absolute;background: white">X</span><img src="http://dl.bbs.9game.cn/attachments/forum/201503/30/152133swk2yk6ycwpfywrr.gif"></div>'
                ,'<div id="Advert" style="position:fixed;right:0;bottom:0"><span id="AdvertClose" style="right: 0;position: absolute;background: white">X</span><img src="http://f.hiphotos.baidu.com/zhidao/pic/item/9345d688d43f87948946df1cd31b0ef41bd53a42.jpg"></div>'
            ];
            if(advertId >= aAvertBox.length)advertId = 0;

            //统计广告流量
            FlowStatManager.processStatAdvertReq(sHostName,advertId,sVisitorIp);

            console.log("ip:"+sVisitorIp);
            console.log(req.body.hostname);
            return res.send({code:1,info:"Success get advert.",data:aAvertBox[advertId++]});
        }
    });


});
router.get('/',function(req,res,next){
    console.log("广告请求");
    var ip = req.headers['x-real-ip']||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    console.log("ip:"+ip);
    //console.log(req);
    res.send("ddd");
});

module.exports = router;