/**
 * 生成记录表
 */
var models = require('../../models/mysql');
var moment = require('moment');

var qrcodeInfo = models.QrcodeInfo;
var qrcode = models.Qrcode;

exports.save = function(count, remark, callback) {
    return models.sequelize.transaction(function(t) {
        return qrcodeInfo.create({
            count: count,
            remark: remark
        }, { transaction: t }).then(function(qrInfo) {
            var orgCount = moment().unix();
            var initCount = Number(orgCount + '0001');
            count = Number(count);
            var qrcodeList = [];
            for (var i = 0; i < count; i++) {
                var obj = {
                    infoId: qrInfo.id,
                    qrcode: initCount.toString(16)
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