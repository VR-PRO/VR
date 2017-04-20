var models = require('../../models/mysql');

var Agent = models.Agent;

exports.save = function(_agent, callback) {
    return models.sequelize.transaction(function(t) {
        return Agent.create({
            name: _agent.name,
            mobile: _agent.mobile,
            rate: _agent.rate,
            remark: _agent.remark,
        }, { transaction: t });
    }).then(function(agent) {
        var res = agent && agent.dataValues ? agent.dataValues : null;
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, name, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };

    var w = {};
    if (name) {
        w.name = { $like: '%' + name + '%' };
    }
    opt.where = w;
    Agent.findAndCountAll(opt).then(function(result) {
        callback(result);
    });
}

exports.detail = function(mobile, callback) {
    Agent.findOne({
        where: {
            mobile: mobile
        }
    }).then(function(agent) {
        callback(agent);
    });
}