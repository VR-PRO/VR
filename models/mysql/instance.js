/**
 * Created by WG on 2017/3/24.
 * 对外export model
 */
let sysCfg = require('../../config');
let mysqlCfg = sysCfg.mysql;
let logger = require('../../common/logger');

let Sequelize = require('sequelize');
let config = {
    database: mysqlCfg.database,
    username: mysqlCfg.username,
    password: mysqlCfg.password,
    options: {
        host: mysqlCfg.host,
        port: mysqlCfg.port,
        dialect: 'mysql',
        timezone: '+08:00',
        pool: {
            max: 5, // 连接池中最大连接数量
            min: 0, // 连接池中最小连接数量
            idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
        },
        define: {
            freezeTableName: true,
            timestamps: false
        }
    },
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
};

exports.sequelize = function () {
    return new Sequelize(config.database, config.username, config.password, config.options);
}