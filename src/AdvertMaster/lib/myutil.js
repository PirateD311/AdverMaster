require("./CONST");

/*util 模块
* 功能如下：
* 1.日志
* */

var log4js = require('log4js');

log4js.configure({
    appenders:[
        {type:'console'},
        {
            type:'file',
            filename:'access.log',
            maxLogSize:10240,
            backups:3,
            category:'normal'
        }
    ],
    replaceConsole:true
});
var loger = log4js.getLogger('INFO');
module.exports.log4js = log4js;
module.exports.getLogger = loger;

global.logger = log4js.getLogger('INFO');

/*数组扩展方法
* */

var isInArray = function(value,array){
    if(array instanceof Array){
        for(i in array){
            if(array[i] === value){
                return [true,i];
            }
        }
        return [false,-1];
    }else{
        return [false,-1];
    }
}
module.exports.isInArray = isInArray;

//过滤对象的参数
function field(keys,data){
    var result = {};
    if(keys instanceof Array){
        for(var i=0;i<keys.length;i++){
            if(!data[keys[i]]){
                console.log(keys[i]+"不存在于data中");
                return false;
            }
            result[keys[i]] = data[keys[i]];
        }
        return result;
    }else{
        console.log("keys not array");
        return false;
    }
}
module.exports.field = field;

//生成query
function filter(keys,data)
{
    var result = {};
    if(keys instanceof Array){
        for(var key of keys){
            if(data[key]){
                result[key] = data[key];
            }else{
                console.log(key+"不存在于data中");
            }

        }

        return result;
    }else{
        console.log("keys not array");
        return null;
    }
}
module.exports.filter = filter;

//判断用户是否登录
function isLogin(req){
    if(!req.session)return false;
    if(req.session.logged_in
        && req.session.logged_username
        && req.session.logged_uid
        && req.session.logged_rpg)
    {
        return true;
    }else{
        return false;
    }
}
module.exports.isLogin = isLogin;