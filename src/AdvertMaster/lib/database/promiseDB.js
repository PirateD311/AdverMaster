/**
 * Created by liuxun on 16/12/2.
 */
var Promise = require('bluebird');
var mongoose = require('mongoose');
var DBMode = require('./MongoDBMode');
var DBManager = require('./MongoDBManager').DBManager;
//console.log(mongoose.Model.find.toString());


mongoose.model('User').find({'sUserName':'liuxun'}).then(function(doc){
    console.log(doc);
});
//console.log(mongoose.Model.prototype.find_pro.toString());

function demo(i){

    var p = new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("%d s 过去了。。。",i);
            if(i > 10)reject();
            resolve(2*i);
        },i*1000);
    });
    return p
}





//demo(1).then(function(data){
//    console.log(data);
//        console.log("唉丫丫");
//        return demo(data);
//    })
//    .then(function(data){
//        return demo(data);
//    })
//    .then(function(data){
//        return demo(data);
//    })
//    .then(function(data){
//        return demo(data);
//    })
//    .catch(function(){
//        console.log("哎呀，异常啦");
//    });
//demo(1).then(demo).then(demo).then(demo).then(demo);

