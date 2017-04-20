var Dev = require('../proxy/mysql/dev');

//设备的保存
exports.save = function(req, res, next) {

    var roomNum = req.body.roomNum;
    var qrcodeList = req.body.qrcodeList;
    var devCode = req.body.qrcodeList;


};

exports.list = function(req, res, next) {

    var key = req.body.key;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;

    Dev.list(pageNo, pageSize, name, function(error, result) {
        if (error) {
            res.json({ result: 0, msg: '', data: {} });
        } else {
            var totalItems = result.count;
            var list = result.rows;
            res.json({ result: 1, msg: '', data: { totalItems: totalItems, list: list } });
        }
    });


};