/**
 * 订单管理 - service
 */
var models = require('../../models/mysql');

var Order = models.Order;

exports.save = function(_adv, callback) {
    return Adv.create({
        scope: _adv.scope,
        img: _adv.img,
        remark: _adv.remark,
        sort: _adv.sort,
    }).then(function(result) {
        callback(null, result);
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
        w.wxName = {
            $like: '%' + key + '%'
        };
    }
    if (agentId) {
        w.agentId = agentId;
    }
    if (hotelId) {
        w.hotelId = hotelId;
    }
    opt.where = w;
    return Order.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.detail = function(devCode, callback) {
    return Order.findOne({
        where: {
            devCode: devCode,
            orderStatus: 'S_DDZT_DFK', //未支付:S_DDZT_DFK    已支付:S_DDZT_YFK
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}