var models = require('../../models/mysql');

var Dev = models.Dev;
var DevQrcode = models.DevQrcode;
var sequelize = models.sequelize;

exports.save = function(_dev, callback) {

        var qrCodes = [];
        _.forEach(_dev.qrcodeList, function(qr) {
            qrCodes.push(qr.qrcode);
        });

        return models.sequelize.transaction(function(t) {
            return Dev.create({
                roomNum: _dev.roomNum,
                agentId: _dev.agentId,
                hotelId: _dev.hotelId,
                devCode: _dev.devCode,
                qrCodes: qrCodes.join(',')
            }, { transaction: t }).then(function(dev) {
                var tempCommitArr = [];
                _.forEach(_dev.qrcodeList, function(qr) {
                    tempCommitArr.push({ qrCode: qr.qrcode, devId: dev.id });
                });
                return DevQrcode.bulkCreate(tempCommitArr, { transaction: t });
            });
        }).then(function(agent) {
            callback(null, agent);
        }).catch(function(err) {
            callback(err, null);
        });
    }
    /*
    exports.list = function(pageNo, pageSize, key, callback) {
        key = key || '';
        return sequelize.transaction(function(t) {
            var sql = "SELECT dev.roomNum,dev.devCode,dev.created,GROUP_CONCAT(qr.qrcode) AS qrList " +
                " FROM t_v_dev dev LEFT JOIN t_v_dev_qrcode qr ON qr.devId = dev.id " +
                " WHERE dev.roomNum LIKE '%" + key + "%' OR dev.devCode LIKE '%" + key + "%' OR qr.qrcode LIKE '%" + key + "%'  GROUP BY dev.id" +
                " limit " + (pageNo - 1) + "," + pageSize;

            var sqlCnt = "SELECT COUNT(dev.id) AS cnt FROM t_v_dev dev  " +
                " WHERE dev.roomNum LIKE '%" + key + "%' OR dev.devCode LIKE '%" + key + "%' ";

            return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, transaction: t }).then(function(results) {
                return sequelize.query(sqlCnt, { type: sequelize.QueryTypes.SELECT, transaction: t }).then(function(count) {
                    var totalCnt = count[0]['cnt'];
                    results = totalCnt == 0 ? [] : results;
                    return { rows: results, count: totalCnt };
                });
            }).then(function(result) {
                callback(null, result);
            }).catch(function(err) {
                callback(err, null);
            });
        });
    }*/

exports.listE = function(pageNo, pageSize, key, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };
    var w = {};
    if (key) {
        w.hotelId = { $like: '%' + key + '%' };
        w.agentId = { $like: '%' + key + '%' };
        w.qrCodes = { $like: '%' + key + '%' };
        opt.where = w;
    }
    return Dev.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.check = function(name, qrcodes, devcode, callback) {

}