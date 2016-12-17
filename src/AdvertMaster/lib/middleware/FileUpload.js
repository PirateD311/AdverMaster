/**
 * Created by liuxun on 16/11/21.
 */
var fs = require('fs');
var multiparty = require('multiparty');
function uploadFile(req,option,next){
    var form = new multiparty.Form({uploadDir:'public/'+AVATAR_UPLOAD_FOLDER});
    console.log("parse form begin.");
    form.parse(req, function(err, fields, files) {
        console.log(req.body);
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
            next(err,null);
        } else {
            console.log('parse files: ' + filesTmp);
            console.log(files);
            var inputFile = files.uploadFile[0];
            var uploadedPath = inputFile.path;
            var src = 'http://123.206.227.204/'+AVATAR_MATERIAL_DIR+ inputFile.originalFilename
            var dstPath = 'public/'+AVATAR_MATERIAL_DIR+ inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                    next(err,null);
                } else {
                    console.log("uploadFile success");
                    next(err,{src:src,file:inputFile});
                }
            });
        }
    });
}
module.exports.uploadFile = uploadFile;