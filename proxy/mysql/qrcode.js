/**
 * 二维码详细表具体操作
 */
var models = require('../../models/mysql');
var encrypt = require('../../common/crypto');
var config = require('../../config');
var qrcode = models.Qrcode;

exports.list = function(qrInfoId, callback) {
    qrcode.findAll({
        where: {
            infoId: qrInfoId
        }
    }).then(function(qrcodeList) {
        callback(null, qrcodeList);
    }).catch(function(error) {
        callback(error, null);
    });
}