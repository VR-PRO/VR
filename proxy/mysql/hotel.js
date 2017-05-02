var models = require('../../models/mysql');

var Hotel = models.Hotel;

exports.save = function(_hotel, callback) {
    return models.sequelize.transaction(function(t) {
        return Hotel.create({
            name: _hotel.name,
            mobile: _hotel.mobile,
            rate: _hotel.rate,
            agentId: _hotel.agentId,
            userId: _hotel.userId,
            remark: _hotel.remark,
        }, { transaction: t });
    }).then(function(hotel) {
        callback(null, hotel);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, name, agentId, callback) {
    var opt = {
        'limit': pageSize,
        'offset': (pageNo - 1) * pageSize
    };
    var w = {};
    if (name) { w.name = { $like: '%' + name + '%' }; }
    if (agentId) { w.agentId = agentId; }
    if (w.name || w.agentId) { opt.where = w; }
    Hotel.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}
exports.detail = function(userId, callback) {
    Hotel.findOne({
        where: {
            userId: userId
        }
    }).then(function(hotel) {
        callback(null, hotel);
    }).catch(function(error) {
        callback(error, null);
    })
}


exports.update = function(hotel, callback) {
    Hotel.update({
        name: hotel.name,
        addr: hotel.addr,
        pid: hotel.pid,
        cid: hotel.cid,
        mobile: hotel.mobile,
    }, {
        where: {
            userId: hotel.userId
        }
    }).then(function(agent) {
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.detailById = function(hotelId, callback) {
    Hotel.findOne({
        id: hotelId
    }).then(function(hotel) {
        callback(null, hotel);
    }).catch(function(error) {
        callback(error, null);
    })
}