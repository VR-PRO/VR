/**
 * Created by mo on 2017/4/5.
 * 用户管理
 */
var     models      =  require('../../models/mysql');
var     User        =   models

exports.findByName = function(userName) {
    return User.findOne({ where: { user_name: userName } });
};


