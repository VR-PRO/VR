/**
 * 第三方处理
 */
var qiniu = require('qiniu');
var fs = require("fs");
var qnCfg = require("../config").qn_access;
var Agent = require('../proxy/mysql/agent');
var Hotel = require('../proxy/mysql/hotel');

qiniu.conf.ACCESS_KEY = qnCfg.accessKey;
qiniu.conf.SECRET_KEY = qnCfg.secretKey;

exports.uploadImg = function(req, res, next) {
    var filePath = req.files.file.path;
    var putPolicy = new qiniu.rs.PutPolicy(qnCfg.bucket);
    var extra = new qiniu.io.PutExtra();
    var token = putPolicy.token();
    try {
        qiniu.io.putFileWithoutKey(token, filePath, extra, function(err, _res) {
            if (!err) {
                fs.exists(filePath, function(exists) {
                    if (exists) {
                        fs.unlink(filePath, function() {});
                    }
                });
                res.json({ result: 1, msg: '', data: { imgCode: _res.hash } });
            } else {
                res.json({ result: 0, msg: '', data: {} });
            }
        });
    } catch (ex) {
        next(ex);
    }
}
exports.baseInfo = function(req, res, next) {
    var session = req.session;
    var mobile = '';
    if (session && req.session.vr_u) {
        var u = req.session.vr_u;
        switch (u.type) {
            case 'USER_TYPE_AGENT':
                {
                    Agent.detail(u.id, function(error, agent) {
                        if (agent) {
                            res.json({ result: 1, msg: '', data: agent });
                        } else {
                            res.json({ result: 0, msg: '', data: {} });
                        }
                    });
                }
                break;
            case 'USER_TYPE_HOTEL':
                {
                    Hotel.detail(u.id, function(error, hotel) {
                        if (hotel) {
                            res.json({ result: 1, msg: '', data: hotel });
                        } else {
                            res.json({ result: 0, msg: '', data: {} });
                        }
                    });
                }
                break;
        }
    }
}

exports.baseInfoUpdate = function(req, res, next) {
    var session = req.session;
    var mobile = '';
    var reqData = req.body;
    if (session && req.session.vr_u) {
        var u = req.session.vr_u;
        reqData.userId = u.id;
        switch (u.type) {
            case 'USER_TYPE_AGENT':
                {
                    Agent.update(reqData, function(error, agent) {
                        if (agent) {
                            res.json({ result: 1, msg: '', data: agent });
                        } else {
                            res.json({ result: 0, msg: '', data: {} });
                        }
                    });
                }
                break;
            case 'USER_TYPE_HOTEL':
                {
                    Hotel.update(reqData, function(error, hotel) {
                        if (hotel) {
                            res.json({ result: 1, msg: '', data: hotel });
                        } else {
                            res.json({ result: 0, msg: '', data: {} });
                        }
                    });
                }
                break;
        }
    }
}