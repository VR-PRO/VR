/**
 * Created by mo on 2017/3/22.
 */

var config = {
    debug: true, //true:用于本地调试
    port: 3000, //本地服务监听端口
    host: 'localhost', //服务域名
    /*
     * mysql 数据库配置设置
     * */
    mysql: {
        'host': '127.0.0.1',
        'username': 'root',
        'password': 'root',
        'database': 'vr',
        'charset': 'utf8',
        'port': '3306',
    },
    /**
     * mongodb 配置设置
     */
    mongodb: {
        'db': 'mongodb://127.0.0.1/union_log_dev'
    },
    /*
     *七牛 上传配置
     * */
    qn_access: {
        accessKey: '5gJLmQMxqpkxFyc3jJiemQ1JjOR3dUU_VlqatEt0',
        secretKey: 'P3yUtNmXhXCrK13KZCbS7PYWC87nXvEEycuVyf3N',
        bucket: 'vrimgs',
        origin: 'http://oo1rx8l2w.bkt.clouddn.com'
    },
    /*
     * redis 配置
     * */
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 0,
        password: '123456'
    }
};
module.exports = config;