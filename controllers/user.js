var User = require('../proxy/mysql/user');

exports.check = function(req, res, next) {
    var mobile = req.body.mobile;

    User.getUserByMobile(mobile, function(error, user) {
        if (error) {
            res.json({ 'result': 0, 'data': {}, 'msg': error.message });
        } else {
            if (user) {
                res.json({ 'result': 0, 'data': {}, 'msg': '信息已存在.' });
            } else {
                res.json({ 'result': 1, 'data': {}, 'msg': '' });
            }
        }
    });
};