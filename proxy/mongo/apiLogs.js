/**
 * Created by mo on 2017/3/25.
 */
var models = require('../../models/mongo');

var ApiLog = models.ApiLog;

exports.save = function(apiLog, callback) {
    let _apiLog = new ApiLog();
    _apiLog.req_url = apiLog.req_url;
    _apiLog.req_params = apiLog.req_params;
    _apiLog.req_type = apiLog.req_type;

    _apiLog.save(function(err) {
        callback(err, _apiLog);
    });
}

exports.list = function(type, pageNo, pageSize, callback) {
    ApiLog.find().then(function(result) {
        callback(result);
    });
}