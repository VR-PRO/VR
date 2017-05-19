/**
 * 页面路由
 */
'use strict'
var express = require('express');
var auth = require('./middlewares/auth');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var site = require('./controllers/site');
var dev = require('./controllers/dev');
var user = require('./controllers/user');
var agent = require('./controllers/agent');
var hotel = require('./controllers/hotel');
var adv = require('./controllers/adv');
var order = require('./controllers/order');
var qrcode_info = require('./controllers/qrcode_info');
var qrcode = require('./controllers/qrcode');
var common = require('./controllers/common');


//登录路由
router.get('/v_login', site.v_login);
router.post('/do', site.login);
//登出路由
router.get('/logout', site.v_logout);
//首页
router.get('/', auth.authorize, site.index);

//上传图片
router.post('/common/img/upload', auth.authorize, multipartMiddleware, common.uploadImg);


//设备的新增加
router.post('/dev/save', auth.authorize, dev.save);
router.post('/dev/list', auth.authorize, dev.list);
router.post('/dev/check', auth.authorize, dev.check);

//用户mobile检查
router.post('/user/check', auth.authorize, user.check);

//agent 路由
router.post('/agent/save', auth.authorize, agent.save);
router.post('/agent/list', auth.authorize, agent.list);
router.post('/agent/detail', auth.authorize, agent.detail);
router.post('/agent/list/all', auth.authorize, agent.findAll);

//hotel 路由
router.post('/hotel/save', auth.authorize, hotel.save);
router.post('/hotel/list', auth.authorize, hotel.list);
router.post('/hotel/detail', auth.authorize, hotel.detail);
router.post('/hotel/list/agentId', auth.authorize, hotel.listByAgentId);

//adv 路由
router.post('/adv/save', auth.authorize, adv.save);
router.post('/adv/list', auth.authorize, adv.list);

//base info 路由
router.post('/common/base/info', auth.authorize, common.baseInfo);
router.post('/common/base/update', auth.authorize, common.baseInfoUpdate);

//order 路由
router.post('/index/tj', auth.authorize, order.tj);
router.post('/index/tj/list', auth.authorize, order.tjList);
router.post('/order/list', auth.authorize, order.list);

/**
 * 二维码
 */
router.post('/qrcode/info/save', auth.authorize, qrcode_info.save);
router.post('/qrcode/info/list', auth.authorize, qrcode_info.list);
router.post('/qrcode/list', auth.authorize, qrcode.list);
router.get('/qrcode/exportExcel/:id', auth.authorize, qrcode.exportExcel); //跳转到后台

module.exports = router;