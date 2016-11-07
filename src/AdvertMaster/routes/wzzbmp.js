/**
 * Created by liuxun on 16/9/10.
 */
const router = require("express").Router();
//const logger = require("")
router.get('/:type?',function(req,res,next){
    //鉴权begin
    if(!req.session.logged_in){
        //res.send("未登录");
    }
    //鉴权end

    //检查路由
    bmpRoute(req,res,next);
    //检查路由


});

/*
* 1.查询所有网站统计信息:all
* 2.网站主审核：
* 3.所有网站管理：
* 4.会员管理：
*
* */

function bmpRoute(req,res,next){
    switch (req.params.type){
        case "verifyWebApplication":
            var data = [
                {
                    "sOwnerUserName":"ddd",
                    "sWebIp":"10.137.27.155",
                    "sWebDomain":"www.rrrr58.com",
                    "sWebRegisterDate":"2012/12/21",
                    "nWebState":"1",
                    "nWebCategory":0,
                    "sWebOwnerQQ":"851652491",
                    "sWebOwnerPhone":"13101891378"
                },
                {
                    "sOwnerUserName":"ddd",
                    "sWebIp":"10.137.27.155",
                    "sWebDomain":"www.rrrr58.com",
                    "sWebRegisterDate":"2012/12/21",
                    "nWebState":"1",
                    "nWebCategory":0,
                    "sWebOwnerQQ":"851652491",
                    "sWebOwnerPhone":"13101891378"
                }];
            var tableStyle =
                {tableCategory:2,
                tableTitle:"网站申请管理",
                colTitle:["申请日期","申请用户名","联系电话","网站ip","网站域名","网站类型"],
                colKey:"sWebRegisterDate,sOwnerUserName,sWebOwnerPhone,sWebIp,sWebDomain,nWebCategory"};
            res.render('Advert_BMP_index',{title:"wzzbmp",tableStyle:tableStyle, postUrl:"getWebSiteInfo/"+req.params.type});
            break;
        default :
            tableStyle = {tableCategory:1}
            res.render('Advert_BMP_index', {title:"wzzbmp",tableStyle:tableStyle, postUrl:"getWebSiteInfo/"+req.params.type});
    }
}

module.exports = router;