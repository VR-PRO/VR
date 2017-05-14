/**
 * 生成记录表
 */
var models = require('../../models/mysql');
var encrypt = require('../../common/crypto');
var config = require('../../config');
var moment = require('moment');

var qrcodeInfo = models.QrcodeInfo;
var qrcode = models.Qrcode;

exports.save = function(count, remark, callback) {
    return models.sequelize.transaction(function(t) {
        return qrcodeInfo.create({
            count: count,
            remark: remark
        }, { transaction: t }).then(function(qrInfo) {
            var dtStr = moment(qrInfo.created).format("YYYYMMDDHHmmss");
            var initCount = 1;
            count = Number(count);
            var qrcodeList = [];
            for (var i = 0; i < count; i++) {
                var tempNumber = '000000' + initCount;
                var initQrcode = 'vr' + dtStr + tempNumber.substr(-4);
                var encryptQrcode = encrypt.encrypt(config.cryptoKey, config.cryptoIv, initQrcode);

                var obj = {
                    infoId: qrInfo.id,
                    qrcode: encryptQrcode,
                    init_qrcode: initQrcode,
                    crypto_key: config.cryptoKey,
                    crypto_iv: config.cryptoIv,
                };
                qrcodeList.push(obj);
                initCount = initCount + 1;
            }
            return qrcode.bulkCreate(qrcodeList, { transaction: t });
        });

    }).then(function(qrcode) {
        callback(null, qrcode);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(callback) {
    qrcodeInfo.findAll().then(function(list) {
        callback(null, list);
    }).catch(function(error) {
        callback(error, null);
    });
}