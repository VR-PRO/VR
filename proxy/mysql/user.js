/**
 * Created by mo on 2017/4/5.
 * 用户管理
 */
var models = require('../../models/mysql');

var User = models.User;

exports.getUserByMobile = function(mobile, callback) {
    User.findOne({ where: { mobile: mobile } }).then(function(user) {
        callback(user);
    });
};