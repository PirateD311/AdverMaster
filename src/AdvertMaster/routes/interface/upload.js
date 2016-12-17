/**
 * Created by liuxun on 16/11/21.
 */
var router = require("express").Router();
var DBManager = require('../../lib/database/MongoDBManager').DBManager;
var FileUpload = require('../../lib/middleware/FileUpload');
var multer = require('multer');
var upload = multer({dest:'uploads/'}).single('uploadFile');
//upload.single('uploadFile'),
router.post("/",function(req,res,next){
    console.log(req.body);
    console.log(req.files);
    console.log(req.file);
    upload(req,res,function(err){
        console.log("###########");
        console.log(req.body);
        console.log(req.files);
        console.log(req.file);
    });
    uploadFile(req,res,function(){
        res.send("Failed.");
    });
});

function uploadFile(req,res,next){
    FileUpload.uploadFile(req,{},function(err,doc){
        if(err){
            return {code:RESULT_CODE_DBERROR,info:JSON.stringify(err)};
        }else{
            DBManager.addMaterial({sSrc:doc.src,sType:doc.file.headers["content-type"],nSize:doc.file.size},function(err){
                if(err){
                    return {code:RESULT_CODE_DBERROR,info:JSON.stringify(err)};
                }else{
                    console.log("upload and add ok");
                    return res.send("OK");
                }
            });
        }
    });


}

module.exports = router;