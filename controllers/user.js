var User = require('../proxy/mysql/user');

exports.check = function(req, res, next) {
    var mobile = req.body.mobile;

    User.getUserByMobile(mobile, function(user) {
        if (user) {
            res.json({ 'result': 0, 'data': {}, 'msg': '供应商信息已存在.' });
        } else {
            res.json({ 'result': 1, 'data': {}, 'msg': '' });
        }
    });
};