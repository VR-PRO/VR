/**
 * 页面路由
 */
'use strict'
let express    =        require('express');
let router      =        express.Router();

let site       =        require('./controllers/site');


//登录路由

//登出路由

//首页路由
router.get('/',site.index);


module.exports = router;