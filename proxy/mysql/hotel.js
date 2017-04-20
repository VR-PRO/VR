var models = require('../../models/mysql');

var Hotel = models.Hotel;

exports.save = function(_hotel, callback) {
    return models.sequelize.transaction(function(t) {
        return Hotel.create({
            name: _hotel.name,
            mobile: _hotel.mobile,
            rate: _hotel.rate,
            agentId: _hotel.agentId,
            remark: _hotel.remark,
        }, { transaction: t });
    }).then(function(hotel) {
        var res = hotel && hotel.dataValues ? hotel.dataValues : null;
        callback(null, hotel);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, name, agentId, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };
    var w = {};
    if (name) {
        w.name = { $like: '%' + name + '%' };
    }
    if (agentId) {
        w.agentId = agentId;
    }
    opt.where = w;
    Hotel.findAndCountAll(opt).then(function(result) {
        callback(result);
    });
}

exports.detail = function(mobile, callback) {
    Hotel.findOne({
        where: {
            mobile: mobile
        }
    }).then(function(hotel) {
        callback(hotel);
    });
}