/**
 * 页面路由
 */
'use strict'
var express = require('express');
var auth = require('./middlewares/auth');
var router = express.Router();
var site = require('./controllers/site');

//路由过滤器
router.all('*', auth.loginReq);
//登录路由
router.get('/v_login', site.v_login);
router.post('/do', site.login);
//登出路由
router.get('/v_logout', site.v_logout);
//首页
router.get('/', site.index);


module.exports = router;