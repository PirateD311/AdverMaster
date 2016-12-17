/**
 * Created by liuxun on 16/11/17.
 */
var router = require('express').Router();
var Auth = require('../../lib/middleware/authority/AuthrityManager');
var DBManager = require('../../lib/database/MongoDBManager').DBManager;

router.post("/:option?",function(req,res,next){
    console.log(req.params.option);
    if(!req.params.option){
        Auth.processBussinessManagerAuth(req,res,function(){

            var resultJson = {code:0,info:"",data:[],tableStyle:{tableTitle:"",tableCategory:"",colTitle:"",colKey:[]}};
            resultJson.code = RESULT_CODE_SUCCESS;
            resultJson.tableStyle.tableTitle = "全部广告";
            resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
            resultJson.tableStyle["options"] = ["锁定广告","修改"];
            resultJson.tableStyle.colTitle = "广告Id,广告主账户,广告标题,展示类型,单价,总投量,单日投放,剩余,链接,素材id,状态";
            resultJson.tableStyle.colKey = ["nId","sOwnerName","sName","sDisplayType","nAdvertPrice","nMaxCount","nMaxDayCount","nResidue","sHref","nMaterialId","sAdvertState"];

            DBManager.getAdvertInfoModel().find(function(err,doc){
                console.log(doc);
                if(err||!doc){
                    resultJson.code = RESULT_CODE_DBERROR;
                    resultJson.info = "数据库异常";
                    return res.send(resultJson);
                }else{
                    resultJson.data = [];
                    doc.map(function(advert){
                        var data = {};
                        resultJson.tableStyle.colKey.map(function(key){
                            data[key] = advert[key];
                        });
                        data["nUseStock"] = 88;
                        data["id"] = advert['_id'];
                        console.log(data);
                        resultJson.data.push(data);
                    });
                    console.log(doc);
                    return res.send(resultJson);
                }
            });
        });
    }else{
        switch (req.params.option){
            case "":
                break;
            default :
                next();
        }
    }

});

module.exports = router;