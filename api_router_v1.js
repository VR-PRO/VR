/**
 * 页面路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var adv = require('./controllers/adv');

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