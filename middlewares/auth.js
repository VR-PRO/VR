/**
 * session 验证
 */

exports.loginReq = function(req, res, next) {
     if (req.originalUrl &&
        req.originalUrl.indexOf('v_login') == -1 &&
        (!req.session || !req.session.vr_u)) {
        return res.redirect('/v_login');
    }
    next();
};