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

exports.list = function(pageNo, pageSize, key, agentId, hotelId, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };
    key = key || '';
    var w = {};
    if (key) {
        w.$or = [
            { hotelId: { $like: '%' + key + '%' } },
            { agentId: { $like: '%' + key + '%' } },
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

exports.check = function(name, qrcodes, devcode, callback) {

}

exports.findDevListByAgentIds = function(agentIds, callback) {
    Dev.findAndCount({
        group: ['agentId'],
        where: {
            agentId: {
                $in: [agentIds]
            }
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.findDevListByHotelIds = function(hotelIds, callback) {
    Dev.findAndCount({
        where: {
            $in: hotelIds
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}