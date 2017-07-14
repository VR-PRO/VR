/**
 * 订单管理 - service
 */
var models = require('../../models/mysql');
var moment = require('moment');

var Order = models.Order;
var sequelize = models.sequelize;

exports.save = function(order, callback) {
    return Order.create({
        movieName: order.movieName,
        agentId: order.agentId,
        hotelId: order.hotelId,
        openId: order.openId,
        realFee: order.realFee,
        devCode: order.devCode,
        addr: order.addr,
        wxName: order.nickName,
        prepayid: order.prepayid,
        out_trade_no: order.out_trade_no
    }).then(function(result) {
        callback(null, result);
    });
}

exports.list = function(pageNo, pageSize, key, agentIds, hotelIds, st, et, callback) {
    var opt = {
        'limit': pageSize,
        'offset': (pageNo - 1) * pageSize
    };
    key = key || '';
    var w = {
        created: {
            $gte: st,
            $lte: et
        }
    };
    if (key) {
        w.wxName = {
            $like: '%' + key + '%'
        };
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
            created: {
                $lte: moment().add(1, 'days').format("YYYY-MM-DD 13:00:00")
            }
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
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" ';
    var hotelSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" ';
    var devSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ' +
        ' FROM t_v_order o ' +
        ' LEFT JOIN t_v_dev  d ON d.devCode = o.devCode ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" ';

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
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" GROUP BY o.agentId';
    var hotelSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt,a.name ' +
        ' FROM t_v_order o  ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" ';
    var devSql = 'SELECT SUM(o.realFee) AS income,SUM(o.realFee*a.rate/100) AS commission,COUNT(o.id) AS devCnt ,d.roomNum AS name' +
        ' FROM t_v_order o ' +
        ' LEFT JOIN t_v_dev  d ON d.devCode = o.devCode ' +
        ' LEFT JOIN t_v_hotel a ON a.id = o.hotelId ' +
        ' WHERE o.created >= "' + st + '" AND o.created <= "' + et + '" AND o.payStatus ="S_ZFZT_YZF" ';

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


exports.isplay = function(devcode, movieKey, callback) {
    return Order.findOne({
        where: {
            devCode: devCode,
            payStatus: 'S_ZFZT_YZF'
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.detailByDevCode = function(devCode, callback) {
    return Order.findAll({
        where: {
            devCode: devCode,
            created: {
                $lte: moment().add(1, 'days').format("YYYY-MM-DD 13:00:00")
            }
        }
    }).then(function(result) {
        callback(null, result);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.updateIsPlay = function(callback) {
    var sql = 'UPDATE t_v_order o SET o.isPlay = 0 WHERE o.isPlay = 1 AND  ADDDATE(o.created,INTERVAL 24 HOUR ) <= NOW()';
    sequelize.query(sql, {
        type: sequelize.QueryTypes.UPDATE
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.updatePayResult = function(out_trade_no, callback) {
    var sql = 'UPDATE t_v_order o SET o.payStatus = "S_ZFZT_YZF" WHERE o.out_trade_no="' + out_trade_no + '"';
    sequelize.query(sql, {
        type: sequelize.QueryTypes.UPDATE
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}

exports.updateOutTradeNo = function(out_trade_no, id, callback) {
    var sql = 'UPDATE t_v_order o SET o.out_trade_no = "' + out_trade_no + '" WHERE o.id=' + id;
    sequelize.query(sql, {
        type: sequelize.QueryTypes.UPDATE
    }).then(function(results) {
        callback(null, results);
    }).catch(function(error) {
        callback(error, null);
    });
}