var QrcodeInfo = require('../proxy/mysql/qrcode_info');

exports.save = function(req, res, next) {
    var count = req.body.count;
    var remark = req.body.remark;

    QrcodeInfo.save(count, remark, function(error, qrInfo) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: {} });
        } else {
            res.json({ result: 1, msg: "", data: qrInfo });
        }
    });
}

exports.list = function(req, res, next) {
    QrcodeInfo.list(function(error, list) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: {} });
        } else {
            res.json({ result: 1, msg: "", data: list });
        }
    });
}