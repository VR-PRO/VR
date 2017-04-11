/**
 * Created by mo on 2017/3/25.
 */
var moment = require('moment');
moment.locale('zh-cn'); // 使用中文

module.exports = function (schema) {
    schema.methods.created = function () {
        return moment().format('YYYY-MM-DD HH:mm:ss')
    };
};