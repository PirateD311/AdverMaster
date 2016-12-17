/**
 * Created by liuxun on 16/11/21.
 */
var DBManager = require("../database/MongoDBManager").DBManager;

/*素材查询接口
* */
function qryMaterial(req,next){
    DBManager.getMaterial().find(function(err,doc){
        if(err){
            console.log(err);
            next(err,null);
        }
        var resultJson = {code:0,info:"",data:[],tableStyle:{tableTitle:"",tableCategory:"",colTitle:"",colKey:[]}};
        resultJson.code = RESULT_CODE_SUCCESS;
        resultJson.tableStyle.tableTitle = "全部素材";
        resultJson.tableStyle.tableCategory = CONST.TABLE_CATEGORY_WITHOPTION;
        resultJson.tableStyle["options"] = ["修改素材"];
        resultJson.tableStyle.colTitle = "素材Id,预览,上传日期";
        resultJson.tableStyle.colKey = ["nId","sSrc","sUploadDate"];

        doc.map(function(material){
            var data = {};
            resultJson.tableStyle.colKey.map(function(key){
                data[key] = material[key];
            });
            //data["show"] = '<img src="'+data["sSrc"]+'" />'
            resultJson.data.push(data);
        });
        next(null,resultJson);
    });
}
module.exports.qryMaterial = qryMaterial;

/*上传素材接口
* */
function uploadImg(req,next){

}
module.exports.uploadImg = uploadImg;