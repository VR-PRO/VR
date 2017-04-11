/**
 * Created by mo on 2017/3/24.
 */
let     config      =      require('../config');
let     env         =      process.env.NODE_ENV || "development"
let     log4js      =      require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/sys_log.log', category: 'sys_log' }
    ]
});

let     logger      =       log4js.getLogger('sys_log');
logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR');

module.exports = logger;