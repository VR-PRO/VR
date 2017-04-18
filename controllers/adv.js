var Adv = require('../proxy/mysql/adv');

exports.save = function(req, res, next) {
    var scope = req.body.scope;
    var img = req.body.img;
    var sort = req.body.sort || 0;
    var remark = req.body.remark || '';

    var adv = {
        scope: scope,
        img: img,
        sort: sort,
        remark: remark,
    };

    Adv.save(adv, function(error, _agent) {
        if (error) {
            res.json({ result: 0, msg: '操作失败.', data: {} });
        } else {
            if (_agent) {
                res.json({ result: 1, msg: '操作成功.', data: {} });
            } else {
                res.json({ result: 0, msg: '操作失败.', data: {} });
            }
        }
    });
};
//列表
exports.list = function(req, res, next) {
    Adv.list(function(result) {
        res.json({ result: 1, msg: '', data: result });
    });
};