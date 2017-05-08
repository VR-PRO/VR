var Agent = require('../proxy/mysql/agent');
var User = require('../proxy/mysql/user');
var Dev = require('../proxy/mysql/dev');

exports.save = function(req, res, next) {
    var name = req.body.name;
    var mobile = req.body.mobile;
    var rate = req.body.rate;
    var remark = req.body.remark || '';
    var pwd = req.body.pwd;

    //改造--> 先存储 user --> agent
    User.save(mobile, pwd, 'USER_TYPE_AGENT', function(error, _user) {
        if (error) {
            res.json({ result: 0, msg: '操作失败.', data: {} });
        } else {
            Agent.save({
                name: name,
                mobile: mobile,
                rate: rate,
                userId: _user.id,
                remark: remark
            }, function(error, _agent) {
                if (error) {
                    res.json({ result: 0, msg: '操作失败.', data: {} });
                } else {
                    res.json({ result: 1, msg: '操作成功.', data: {} });
                }
            });
        }
    });
};
exports.list = function(req, res, next) {
    var name = req.body.name;
    var pageNo = Number(req.body.pageNo);
    var pageSize = Number(req.body.pageSize);

    Agent.list(pageNo, pageSize, name, function(error, result) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: {} });
        } else {
            var totalItems = result.count;
            var list = result.rows;
            if (totalItems > 0) {
                var agentIds = [];
                _.forEach(result.rows, function(item) {
                    agentIds.push(item.id);
                });

                Dev.findAllByAgentIds(agentIds, function(error, _result) {
                    if (error) {
                        res.json({ result: 0, msg: error.message, data: {} });
                    } else {
                        res.json({ result: 1, msg: '', data: { totalItems: totalItems, list: list, devArr: _result } });
                    }
                });
            } else {
                res.json({ result: 1, msg: '', data: { totalItems: totalItems, list: list, devArr: [] } });
            }
        }
    });
};

exports.detail = function(req, res, next) {
    var session = req.session;
    var userId = '';
    if (session && req.session.vr_u) {
        userId = req.session.vr_u.id;
    }
    Agent.detail(userId, function(error, agent) {
        if (error) {
            res.json({ result: 0, msg: '', data: {} });
        } else {
            res.json({ result: 1, msg: '', data: agent });
        }
    });
}

exports.findAll = function(req, res, next) {
    Agent.findAll(function(error, result) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: [] });
        } else {
            res.json({ result: 1, msg: '', data: result });
        }
    });
}