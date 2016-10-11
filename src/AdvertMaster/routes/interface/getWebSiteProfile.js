/**
 * Created by liuxun on 16/9/16.
 */
const router = reuqire('express');

router.post('/:option?',function(req,res,next){
   var ret =
   {
       code:0,
       data:[
           {sUserName:"liuxun",
            sRegisterDate:"2016/1/1",
            sWebDomain:"www.baidu.com",
            sUserPhone:"110112115",
            sUserQQ:"1351251",
            sWebCategory:"游戏",
            nWebState:0,
           }
       ]
   };
    var option = req.params.option;
   console.log("request option is %s",option);

    switch (option)
    {
        case "all":
            return res.send(ret);
            break;
        case "qrybystate":
            return res.send(ret);
            break;
        default:
            return res.send({code:2,data:null});
    }

});

module.exports = router;