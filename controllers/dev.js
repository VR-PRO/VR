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
    var agentId = req.body.agentId || '';
    var hotelId = req.body.hotelId || '';

    if (agentId == '' && hotelId == '') {
        var session = req.session;
        if (session && session.agentId) {
            agentId = session.agentId;
        }
        if (session && session.hotelId) {
            hotelId = session.hotelId;
        }
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

exports.check = function(req, res, next) {
    var devCode = req.body.devCode;
    var qrcodeList = req.body.qrcodeList;
    var qrcodeArr = [];
    _.forEach(qrcodeList, function(item) {
        qrcodeArr.push(item.qrcode);
    });
    Dev.check(qrcodeArr, devCode, function(error, result) {
        if (error) {
            res.json({ result: 1, msg: error, data: true });
        } else {
            res.json({ result: 1, msg: '', data: false });
        }
    });
}