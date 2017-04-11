/**
 * Created by mo on 2017/3/25.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var logger = require('../../common/logger');

mongoose.connect(config.mongodb.db, {
    server: { poolSize: 20 }
}, function(err) {
    if (err) {
        logger.error('connect to %s error: ', config.mongodb.db, err.message);
        process.exit(1);
    }
});

require('./sys_api_log');

exports.ApiLog = mongoose.model('sys_api_log');