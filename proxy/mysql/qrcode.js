/**
 * 二维码详细表具体操作
 */
var models = require('../../models/mysql');
var Qrcode = models.Qrcode;

exports.list = function(qrInfoId, callback) {
    Qrcode.findAll({
        where: {
            infoId: qrInfoId
        }
    }).then(function(qrcodeList) {
        callback(null, qrcodeList);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.detail = function(qrcode, callback) {
    Qrcode.findOne({
        where: {
            qrcode: qrcode
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}