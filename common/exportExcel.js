//http://www.cnblogs.com/lostazrael/p/3384138.html

var excelExport = require('excel-export');
var config = require('../config');

exports.excelExportForQrcode = function(data) {

    var conf = {};

    conf.cols = [
        { caption: '二维码链接地址', type: 'string' },
        { caption: '二维码编码', type: 'string' },
    ];


    var m_data = [];

    var url = 'https://' + config.host + (config.port ? (":" + config.port) : '') + '/api/v1/order/detail/';

    _.forEach(data, function(item) {
        var _url = url + item.qrcode;
        m_data.push([_url, item.qrcode]);
    });
    conf.rows = m_data;

    return excelExport.execute(conf);
}