var models = require('../../models/mysql');

var Dev = models.Dev;
var Qrcode = models.Qrcode;

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
        }, { transaction: t }).then(function() {
            Qrcode.update({
                status: 1,
                devcode: _dev.devCode
            }, {
                where: {
                    qrCode: {
                        $in: qrCodes
                    }
                }
            });
        });
    }).then(function(agent) {
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, key, agentIds, hotelIds, callback) {
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

    if (agentIds && agentIds.length > 0) {
        w.agentId = {
            $in: agentIds
        };
    }
    if (hotelIds && hotelIds.length > 0) {
        w.hotelId = {
            $in: hotelIds
        };
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
        Qrcode.findAll({
            where: {
                qrCode: {
                    $in: qrcodes
                }
            }
        }).then(function(qr) {
            if (qr) {
                var _resultArr = [];
                _.forEach(qr, function(item) {
                    _resultArr.push(item.qrcode);
                    if (item.status == 1) {
                        msg.push('二维码' + item.qrcode + '已被绑定.');
                    }
                });
                if (qrcodes.length != qr.length) {
                    _.forEach(qrcodes, function(qrcode) {
                        if (_resultArr.indexOf(qrcode) == -1) {
                            msg.push('二维码' + qrcode + '不存在.');
                        }
                    });
                }
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

exports.detailByQrcode = function(qrcode, callback) {
    var sql = ' SELECT dev.devCode FROM t_v_dev dev \
                 LEFT JOIN t_v_qrcode qrcode ON dev.devCode = qrcode.devcode \
                 WHERE qrcode.qrcode = "' + qrcode + '"';
    sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.detailByDevCode = function(devCode, callback) {
    Dev.findOne({
        where: {
            devCode: devCode
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}