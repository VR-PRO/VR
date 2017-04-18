/**
 * 第三方处理
 */
var qiniu = require('qiniu');
var fs = require("fs");
var qnCfg = require("../config").qn_access;

qiniu.conf.ACCESS_KEY = qnCfg.accessKey;
qiniu.conf.SECRET_KEY = qnCfg.secretKey;

exports.uploadImg = function(req, res, next) {
    var filePath = req.files.file.path;
    var putPolicy = new qiniu.rs.PutPolicy(qnCfg.bucket);
    var extra = new qiniu.io.PutExtra();
    var token = putPolicy.token();
    try {
        qiniu.io.putFileWithoutKey(token, filePath, extra, function(err, _res) {
            if (!err) {
                fs.exists(filePath, function(exists) {
                    if (exists) {
                        fs.unlink(filePath, function() {});
                    }
                });
                res.json({result:1,msg:'',data:{imgCode:_res.hash}});
            } else {
                res.json({result:0,msg:'',data:{}});
            }
        });
    } catch (ex) {
        next(ex);
    }
};