var models = require('../../models/mysql');

var Hotel = models.Hotel;

exports.save = function(_hotel, callback) {
    return models.sequelize.transaction(function(t) {
        return Hotel.create({
            name: _hotel.name,
            mobile: _hotel.mobile,
            rate: _hotel.rate,
            remark: _hotel.remark,
        }, { transaction: t });
    }).then(function(hotel) {
        var res = hotel && hotel.dataValues ? hotel.dataValues : null;
        callback(null, hotel);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, name, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };
    if (name) {
        opt.where = {
            name: {
                $like: '%' + name + '%'
            }
        }
    }
    Hotel.findAndCountAll(opt).then(function(result) {
        callback(result);
    });
}