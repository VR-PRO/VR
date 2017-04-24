var Hotel = require('../proxy/mysql/hotel');
var Agent = require('../proxy/mysql/agent');
var User = require('../proxy/mysql/user');

exports.save = function(req, res, next) {
    var name = req.body.name;
    var mobile = req.body.mobile;
    var rate = req.body.rate;
    var remark = req.body.remark || '';
    var pwd = req.body.pwd;

    var session = req.session;
    var agentId = '';
    if (session && req.session.agentId) {
        agentId = req.session.agentId;
    }

    //改造--> 先存储 user --> agent
    User.save(mobile, pwd, 'USER_TYPE_HOTEL', function(error, _user) {
        if (error) {
            res.json({ result: 0, msg: '操作失败.', data: {} });
        } else {
            Hotel.save({
                name: name,
                mobile: mobile,
                rate: rate,
                agentId: agentId,
                userId: _user.id,
                remark: remark
            }, function(error, hotel) {
                if (error) {
                    res.json({ result: 0, msg: error.message, data: {} });
                } else {
                    res.json({ result: 1, msg: '操作成功.', data: {} });
                }
            });
        }
    });
};

exports.list = function(req, res, next) {
    var name = req.body.name;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;

    var session = req.session;
    var agentId = '';
    if (session && req.session.agentId) {
        agentId = req.session.agentId;
    }
    Hotel.list(pageNo, pageSize, name, agentId, function(error, result) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: error });
        } else {
            var totalItems = result.count;
            var list = result.rows;
            res.json({ result: 1, msg: '', data: { totalItems: totalItems, list: list } });
        }
    });
};

exports.detail = function(req, res, next) {
    var session = req.session;
    var userId = '';
    if (session && req.session.vr_u) {
        userId = req.session.vr_u.id;
    }
    Hotel.detail(userId, function(error, hotel) {
        if (hotel) {
            res.json({ result: 1, msg: '', data: hotel });
        } else {
            res.json({ result: 0, msg: '', data: error.message });
        }
    });
}