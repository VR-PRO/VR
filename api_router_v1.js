/**
 * 页面路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var adv = require('./controllers/adv');
var order = require('./controllers/order');
var wx = require('./wx/wxpay');
var logger = require('./common/logger');
var moment = require('moment');

//小程序端接口
/**
 * 根据二维码查询是否有订单信息
 */
router.get('/order/detail/:qrcode', order.detailByQrcode);

//预支付订单
router.post('/wx/order', function(req, res, next) {
    var agentId = '';
    var hotelId = '';
    var openId = req.body.openId || '';
    var realFee = req.body.realFee;
    var devCode = req.body.devCode;
    var nickName = req.body.nickName;

    var shopOrderId = moment().format('YYYYMMDD') + wx.createNonceStr();
    logger.info("input wx-order:");
    wx.order(openId, shopOrderId, realFee).then(function(_res) {
        logger.info("input create:");
        order.create(openId, devCode, realFee, shopOrderId, nickName, _res, res);
    }).catch(function(err) {
        logger.error(err);
        next(err);
    });
});
router.post('/wx/jscode2session', function(req, res, next) {
    var code = req.body.code || '';
    wx.jscode2session(code).then(function(data) {
        res.json({ result: 1, msg: '', data: data });
    }).catch(function(err) {
        logger.error(err);
        res.json({ result: 0, msg: '后端错误', data: {} });
    });

});
router.post('/wx/notify', wx.notify);

//眼镜端接口
/**
 * 设备是否可以玩
 */
router.get('/dev/isplay/:devcode', order.isplay);
router.get('/adv/list', adv.api_v1_list);

module.exports = router;