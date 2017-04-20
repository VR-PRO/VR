var models = require('../../models/mysql');

var Dev = models.Dev;

exports.save = function(_agent, callback) {
    return models.sequelize.transaction(function(t) {
        return Dev.create({
            name: _agent.name,
            mobile: _agent.mobile,
            rate: _agent.rate,
            userId: _agent.userId,
            remark: _agent.remark,
        }, { transaction: t });
    }).then(function(agent) {
        var res = agent && agent.dataValues ? agent.dataValues : null;
        callback(null, agent);
    }).catch(function(err) {
        callback(err, null);
    });
}

exports.list = function(pageNo, pageSize, key, callback) {
    var opt = {
        'limit': pageSize,
        'offset': pageNo - 1
    };
    if (key) {
        var w = {};
        w.roomNum = { $like: '%' + key + '%' };
        w.roomNum = { $like: '%' + key + '%' };
        opt.where = w;
    }
    Agent.findAndCountAll(opt).then(function(result) {
        callback(null, result);
    }).catch(function(err) {
        callback(err, null);
    });
}