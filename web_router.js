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
var common = require('./controllers/common');


//路由过滤器
router.all('*', auth.loginReq);
//登录路由
router.get('/v_login', site.v_login);
router.post('/do', site.login);
//登出路由
router.get('/logout', site.v_logout);
//首页
router.get('/', site.index);

//上传图片
router.post('/common/img/upload', multipartMiddleware, common.uploadImg);


//设备的新增加
router.post('/dev/save', dev.save);
router.post('/dev/list', dev.list);

//用户mobile检查
router.post('/user/check', user.check);

//agent 路由
router.post('/agent/save', agent.save);
router.post('/agent/list', agent.list);
router.post('/agent/detail', agent.detail);

//hotel 路由
router.post('/hotel/save', hotel.save);
router.post('/hotel/list', hotel.list);
router.post('/hotel/detail', hotel.detail);

//adv 路由
router.post('/adv/save', adv.save);
router.post('/adv/list', adv.list);

//base info 路由
router.post('/common/base/info', common.baseInfo);
router.post('/common/base/update', common.baseInfoUpdate);

module.exports = router;