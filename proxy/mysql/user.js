/**
 * Created by mo on 2017/4/5.
 * 用户管理
 */
var models = require('../../models/mysql');
var utils = require('utility');

var User = models.User;

exports.getUserByMobile = function(mobile, callback) {
    User.findOne({ where: { mobile: mobile } }).then(function(user) {
        var　 res = user && user.dataValues ? user.dataValues : null;
        callback(res);
    });
};

exports.save = function(mobile, pwd, type, callback) {
    var passwordMd5 = utils.md5(pwd, 'base64');
    User.create({ mobile: mobile, pwd: passwordMd5, type: type, status: 1 }).then(function(user) {
        var　 res = user && user.dataValues ? user.dataValues : null;
        callback(res);
    });
};