/**
 * 路由的控制
 */
var utils = require('utility');
var User = require('../proxy/mysql/user');
var Agent = require('../proxy/mysql/agent');
var Hotel = require('../proxy/mysql/hotel');

//首页的处理
exports.index = function(req, res, next) {
    var _user = req.session && req.session.vr_u;
    res.render('index', { userType: _user.type });
    next();
};
//登录view处理
exports.v_login = function(req, res, next) {
    res.render('login', { login_error: req.session && req.session.login_error });
    next();
};
//登录处理
exports.login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    req.session.login_error = '';
    req.session.vr_u = null;

    if ([username, password].some(function(item) { return item === ''; })) {
        req.session.login_error = '手机号或密码不可为空';
        res.redirect("/v_login");
    } else {
        User.getUserByMobile(username, function(error, _user) {
            if (_user) {
                var passwordMd5 = utils.md5(password, 'base64');
                if (passwordMd5 != _user.pwd) {
                    req.session.login_error = '密码不正确';
                    res.redirect("/v_login");
                } else {
                    switch (_user.type) {
                        case 'USER_TYPE_ADMIN':
                            {
                                req.session.agentId = '';
                                req.session.hotelId = '';
                                req.session.vr_u = _user;
                                res.redirect("/");
                            }
                            break;
                        case 'USER_TYPE_AGENT':
                            {
                                req.session.hotelId = '';
                                Agent.detail(_user.id, function(error, agent) {
                                    if (agent) {
                                        req.session.vr_u = _user;
                                        req.session.agentId = agent.id;
                                        res.redirect("/");
                                    }
                                });
                            }
                            break;
                        case 'USER_TYPE_HOTEL':
                            {
                                Hotel.detail(_user.id, function(error, hotel) {
                                    if (hotel) {
                                        req.session.vr_u = _user;
                                        req.session.hotelId = hotel.id;
                                        req.session.agentId = hotel.agentId;
                                        res.redirect("/");
                                    }
                                });
                            }
                            break;
                        default:
                            {
                                req.session.agentId = '';
                                req.session.hotelId = '';
                                req.session.vr_u = _user;
                                res.redirect("/");
                            }
                    }
                }
            } else {
                req.session.login_error = '手机号不存在';
                res.redirect("/v_login");
            }
        });
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