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
 * 微信支付回调接口
 */
router.get('/pay/success/:devCode/:orderId', function() {});
/**
 * 获取微信用户的信息(解密)
 */
router.get('/wx/user/:', function() {});

//眼镜端接口
/**
 * 创建订单:
 * 1:设备号
 * 2:电影名称
 * 3:唯一key值(看看能不能提供)
 */
router.post('/order/save', order.save);
/**
 * 影片是否可以观看
 * 1: 电影关键key
 * 2: 设备号
 */
router.get('/movie/isplay/:mkey/:devcode', order.isplay);


/*
  get /api/v1/adv/list 获取广告api接口
  无参数
  返回值示例
  {
    "result":1,
    "msg":"",
    "data":
    [
      {"img":"http://oomrprje8.bkt.clouddn.com/FsLvjs7k-j3p67tq0bbX9qD6MFsY"},
    ]
  }
 */
router.get('/adv/list', adv.api_v1_list);

module.exports = router;