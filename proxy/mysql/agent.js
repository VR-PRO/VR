var models = require('../../models/mysql');

var Agent = models.Agent;

exports.save = function(_agent, callback) {
    return models.sequelize.transaction(function(t) {
        return Agent.create({
            name: _agent.name,
            mobile: _agent.mobile,
            rate: _agent.rate,
            userId: _agent.userId,
            remark: _agent.remark,
        }, { transaction: t });
    }).then(function(agent) {
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, name, callback) {
    var opt = {
        'limit': pageSize,
        'offset': (pageNo - 1) * pageSize
    };
    if (name) {
        var w = {};
        w.name = { $like: '%' + name + '%' };
        opt.where = w;
    }
    Agent.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.detail = function(userId, callback) {
    Agent.findOne({
        where: {
            userId: userId
        }
    }).then(function(agent) {
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.update = function(agent, callback) {
    Agent.update({
        name: agent.name,
        addr: agent.addr,
        pid: agent.pid,
        cid: agent.cid,
        mobile: agent.mobile,
    }, {
        where: {
            userId: agent.userId
        }
    }).then(function(agent) {
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.findAll = function(callback) {
    Agent.findAll().then(function(result) {
        callback && callback(null, result);
    }).catch(function(error) {
        callback && callback(error, null);
    });
}