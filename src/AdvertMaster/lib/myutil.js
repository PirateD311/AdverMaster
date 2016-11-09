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
            filename:'log/access.log',
            maxLogSize:10240,
            backups:3,
            category:'normal'
        }
    ],
    replaceConsole:true
})
module.exports.log4js = log4js;

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