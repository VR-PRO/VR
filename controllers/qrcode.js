var Qrcode = require('../proxy/mysql/qrcode');
var ExportExcel = require('../common/exportExcel');

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

exports.exportExcel = function(req, res, next) {
    var id = req.params['id'];
    if (id) {
        Qrcode.list(id, function(error, list) {
            if (error) {
                res.json({ result: 0, msg: error.message, data: '' });
            } else {
                var result = ExportExcel.excelExportForQrcode(list);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=down.xlsx");
                res.end(result, 'binary');
            }
        });
    } else {
        res.json({ result: 0, msg: '查询条件不可空.', data: '' });
    }
}