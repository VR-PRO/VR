var models = require('../../models/mysql');

var Dev = models.Dev;
var DevQrcode = models.DevQrcode;
var sequelize = models.sequelize;

exports.save = function(_dev, callback) {

    var qrCodes = [];
    _.forEach(_dev.qrcodeList, function(qr) {
        qrCodes.push(qr.qrcode);
    });

    return sequelize.transaction(function(t) {
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

exports.list = function(pageNo, pageSize, key, agentId, hotelId, callback) {
    var opt = {
        'limit': pageSize,
        'offset': (pageNo - 1) * pageSize
    };
    key = key || '';
    var w = {};
    if (key) {
        w.$or = [
            { roomNum: { $like: '%' + key + '%' } },
            { devCode: { $like: '%' + key + '%' } },
            { qrCodes: { $like: '%' + key + '%' } }
        ];
    }
    if (agentId) {
        w.agentId = agentId;
    }
    if (hotelId) {
        w.hotelId = hotelId;
    }
    opt.where = w;
    return Dev.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.check = function(qrcodes, devCode, callback) {
    Dev.count({
        where: {
            devCode: devCode
        }
    }).then(function(cnt) {
        var msg = [];
        if (cnt > 0) {
            msg.push('设备号已存在.');
        }
        DevQrcode.findAll({
            where: {
                qrCode: {
                    $in: qrcodes
                }
            }
        }).then(function(qr) {
            if (qr) {
                _.forEach(qr, function(item) {
                    msg.push('二维码' + item.qrCode + '已存在.');
                })
            }
            if (msg.length > 0) {
                callback(msg, null);
            } else {
                callback(null, {});
            }
        });
    });
}

exports.findAllByAgentIds = function(agentIds, callback) {

    sequelize.query('SELECT COUNT(id) AS cnt,agentId FROM t_v_dev AS t_v_dev WHERE t_v_dev.agentId IN (' + agentIds.join(',') + ') GROUP BY agentId', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.findAllByHotelIds = function(hotelIds, callback) {
    sequelize.query('SELECT COUNT(id)  AS cnt ,hotelId FROM t_v_dev AS t_v_dev WHERE t_v_dev.hotelId IN (' + hotelIds.join(',') + ') GROUP BY hotelId', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}