/**
 * 广告管理 - service
 */
var models = require('../../models/mysql');

var Adv = models.Adv;

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

exports.list = function(callback) {
    return Adv.findAll({
        where: {
            status: 1
        },
        order: 'sort DESC'
    }).then(function(result) {
        callback(null, result);
    });
}

exports.api_v1_list = function(callback) {
    return Adv.findAll({
        where: {
            status: 1
        },
        order: 'sort DESC'
    }).then(function(result) {
        callback(null, result);
    });
}