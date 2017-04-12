/**
 * 路由的控制
 */
var utils = require('utility');
var User = require('../proxy/mysql/user');

//首页的处理
exports.index = function(req, res, next) {
    res.render('index', { userType: 'USER_TYPE_ADMIN' });
    next();
};


//登录view处理
exports.v_login = function(req, res, next) {
    res.render('login', { login_error: req.session && req.session.login_error });
    next();
};
exports.login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    res.session.login_error = '';

    if ([username, password].some(function(item) { return item === ''; })) {
        res.session.login_error = '手机号或密码不可为空';
        res.redirect("/v_login");
    } else {
        var passwordMd5 = utils.md5(password, 'base64');
        var _user = User.getUserByMobile(username);
        if (_user) {
            if (passwordMd5 != _user) {
                res.session.login_error = '密码不正确';
                res.redirect("/v_login");
            } else {
                res.redirect("/");
            }
        } else {
            res.session.login_error = '手机号不存在';
            res.redirect("/v_login");
        }
    }
};


//登出的处理
exports.v_logout = function(req, res, next) {
    try {
        if (req.session && req.session.vr_u) {
            req.session.vr_u = null;
        }
        res.redirect('/v_login');
    } catch (ex) {
        next(ex);
    }
};