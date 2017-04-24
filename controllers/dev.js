var Dev = require('../proxy/mysql/dev');

//设备的保存
exports.save = function(req, res, next) {

    var roomNum = req.body.roomNum;
    var qrcodeList = req.body.qrcodeList;
    var devCode = req.body.devCode;

    var session = req.session;
    var agentId = '';
    var hotelId = '';
    if (session && req.session.agentId) {
        agentId = req.session.agentId;
    }
    if (session && req.session.hotelId) {
        hotelId = req.session.hotelId;
    }

    Dev.save({
        roomNum: roomNum,
        agentId: agentId,
        hotelId: hotelId,
        devCode: devCode,
        qrcodeList: qrcodeList
    }, function(error, result) {
        if (error) {
            res.json({ result: 0, msg: error.message, data: {} });
        } else {
            res.json({ result: 1, msg: '', data: result });
        }
    });

};

exports.list = function(req, res, next) {

    var key = req.body.key;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;

    var session = req.session;
    var agentId = '';
    var hotelId = '';
    if (session && req.session.agentId) {
        agentId = req.session.agentId;
    }
    if (session && req.session.hotelId) {
        hotelId = req.session.hotelId;
    }

    Dev.list(pageNo, pageSize, key, agentId, hotelId, function(error, result) {
        if (error) {
            res.json({ result: 0, msg: '', data: {} });
        } else {
            var totalItems = result.count;
            var list = result.rows;
            res.json({ result: 1, msg: '', data: { totalItems: totalItems, list: list } });
        }
    });
};