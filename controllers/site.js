/**
 * Created by mo on 2017/3/22.
 */
exports.index = function (req, res, next) {

    res.render('index', { title: 'Express' ,userType:'USER_TYPE_ADMIN'});
    next();
}
