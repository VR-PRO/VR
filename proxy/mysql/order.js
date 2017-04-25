/**
 * 订单管理 - service
 */
var models = require('../../models/mysql');

var Order = models.Order;
var sequelize = models.sequelize;

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

exports.tj = function(agent, hotel, dev, st, et, agentId, hotelId, callback) {

    var sql = '';

    var agentSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_agent a ON a.id = o.agentId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" ';
    var hotelSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" ';
    var devSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ' +
        ' FROM t_v_order o ' +
        ' LEFT JOIN t_v_dev  d ON d.devCode = o.devCode ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" ';

    if (agent) { sql = agentSql; }
    if (hotel && agentId) { sql = hotelSql + ' AND o.agentId=' + agentId; }
    if (dev && hotelId) { sql = devSql + ' AND o.hotelId=' + hotelId; }

    sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.tjList = function(agent, hotel, dev, st, et, agentId, hotelId, callback) {
    var sql = '';

    var agentSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt,a.name ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_agent a ON a.id = o.agentId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" GROUP BY o.agentId';
    var hotelSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt,a.name ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" ';
    var devSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ,d.roomNum AS name' +
        ' FROM t_v_order o ' +
        ' LEFT JOIN t_v_dev  d ON d.devCode = o.devCode ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.orderStatus ="S_DDZT_JYCG" ';

    if (agent) { sql = agentSql; }
    if (hotel && agentId) { sql = hotelSql + ' AND o.agentId=' + agentId + '  GROUP BY o.hotelId'; }
    if (dev && hotelId) { sql = devSql + ' AND o.hotelId=' + hotelId + '  GROUP BY o.devCode'; }

    sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}