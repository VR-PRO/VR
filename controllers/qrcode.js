var Qrcode = require('../proxy/mysql/qrcode');

exports.list = function(req, res, next) {
    var qrInfoId = req.body.qrInfoId;
    if (qrInfoId) {
        Qrcode.list(qrInfoId, function(error, list) {
            if (error) {
                res.json({ result: 0, msg: error.message, data: '' });
            } else {
                res.json({ result: 1, msg: '', data: list });
            }
        });
    } else {
        res.json({ result: 0, msg: '查询条件不可空.', data: '' });
    }
}