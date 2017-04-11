/**
 * 七牛上传处理
 */
let qiniu   =   require("qiniu");
let fs      =   require("fs");
let cfg     =   require("../config");

qiniu.conf.ACCESS_KEY = cfg.qn_access.accessKey;
qiniu.conf.SECRET_KEY = cfg.qn_access.secretKey;

/***
 * 七牛上传文件
 * @param key       可以是 文件名称   也可以是 img/文件名
 * @param filePath  可以直接获取
 * @param success   成功回调函数
 * @param error     失败回调函数
 */
qn.putFile = function(key,filePath,success,error){

    success = success || function(){};
    error = error || function(){};

    var putPolicy = new qiniu.rs.PutPolicy(cfg.qn_access.bucketName);
    var extra = new qiniu.io.PutExtra();
    var token = putPolicy.token();
    try{
        qiniu.io.putFile(token,key,filePath,extra,function(err, ret){
            if(!err) {
                deleteFile(filePath);
                success(ret);
            }
            else {
                error(err);
            }
        });
    }catch(ex){
        error(ex);
    }
};

//删除临时文件
function deleteFile(url){
    fs.exists(url,function(exists){
        if(exists){
            fs.unlink(url, function(){});
        }
    });
}