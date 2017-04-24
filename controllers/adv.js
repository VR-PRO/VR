var Adv = require('../proxy/mysql/adv');
var config = require('../config');

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
    Adv.list(function(error, result) {
        if (error) {
            res.json({ result: 0, msg: '', data: {} });
        } else {
            res.json({ result: 1, msg: '', data: result });
        }
    });
};

exports.api_v1_list = function(req, res, next) {
    Adv.api_v1_list(function(error, result) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: {} });
        } else {
            //整理下数据
            var list = [];
            _.forEach(result, function(item) {
                list.push({ img: config.qn_access.origin + item.img });
            });
            res.json({ result: 1, msg: '', data: list });
        }
    });
};