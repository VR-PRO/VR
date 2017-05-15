/**
 * 加密与解密
 */
var crypto = require('crypto');
/**
 * 加密方法 http://www.tuicool.com/articles/YRZFZ3U 
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
exports.encrypt = function(key, iv, data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    var _result = crypted.replace(/\//g, '-');
    return _result;
};

/**
 * 解密方法 http://www.tuicool.com/articles/YRZFZ3U
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
exports.decrypt = function(key, iv, crypted) {
    crypted = crypted.replace(/-/g, '/');
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};