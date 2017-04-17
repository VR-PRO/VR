/**
 * 页面路由
 */
'use strict'
var express = require('express');
var auth = require('./middlewares/auth');
var router = express.Router();
var site = require('./controllers/site');
var dev = require('./controllers/dev');
var user = require('./controllers/user');
var agent = require('./controllers/agent');

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
router.post('/common/img/upload');


//设备的新增加
router.get('/dev/save', dev.save);

//用户mobile检查
router.post('/user/check', user.check);

//agent 路由
router.post('/agent/save', agent.save);
router.post('/agent/list', agent.list);


module.exports = router;