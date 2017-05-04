/**
 * session 验证
 */

exports.loginReq = function(req, res, next) {
    if (req.originalUrl.indexOf('do') >= 0 && req.method == 'GET') {
        return res.redirect('/v_login');
    }
    if (req.originalUrl.indexOf('v_login') == -1 && req.originalUrl.indexOf('do') == -1) {
        if (!req.session || !req.session.vr_u) {
            return res.redirect('/v_login');
        }
    }
    next();
};