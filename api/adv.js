var express = require('express');
var router = express.Router();
var Adv = require('../proxy/mysql/adv');

router.get('/api/adv/list', function(res, req) {
    res.set({ 'Content-Type': 'text/json', 'Encodeing': 'utf8' });
    Adv.list(function(error, result) {
        if (error) {
            res.json({ result: 0, msg: '获取列表失败.', data: {} });
        } else {
            res.json({ result: 1, msg: '', data: result });
        }
    });
});