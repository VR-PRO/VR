/**
 * session 验证
 */
exports.authorize = function(req, res, next) {
    if (!req.session || !req.session.vr_u) {
        return res.redirect('/v_login');
    } else {
        next();
    }
}