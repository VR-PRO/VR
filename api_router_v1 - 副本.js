/**
 * 页面路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var adv = require('./controllers/adv');
var order = require('./controllers/order');


//小程序端接口
/**
 * 根据二维码查询是否有订单信息
 */
router.get('/order/detail/:qrcode', order.detailByQrcode);
/**
 * 创建订单
 */
router.post('/order/save', order.save);
/**
 * 微信支付回调接口
 */
router.get('/pay/success/:devCode/:orderId', function() {});
/**
 * 获取微信用户的信息(解密)
 */
router.get('/wx/user/:', function() {});

//眼镜端接口
/**
<<<<<<< HEAD
 * 设备是否可以玩
=======
 * 创建订单:
 * 1:设备号
 * 2:电影名称
 * 3:唯一key值(看看能不能提供)
 */
//router.post('/order/save', order.save);
/**
 * 影片是否可以观看
 * 1: 电影关键key
 * 2: 设备号
 */
//router.get('/movie/isplay/:mkey/:devcode', order.isplay);

/**
 * 设备是否可以play
>>>>>>> 679d6157972da322172f03b850b783ef0e43019b
 */
router.get('/dev/isplay/:devcode', order.isplay);

router.get('/adv/list', adv.api_v1_list);

module.exports = router;