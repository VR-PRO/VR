/**
 * 第三方处理
 */

var qiniu = require('qiniu');
var fs = require("fs");
var qnCfg = require("../config").qn_access;

exports.uploadImg = function(req, res, next) {

    

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
                success(_res);
            } else {
                error(err);
            }
        });
    } catch (ex) {
        error(ex);
    }
};