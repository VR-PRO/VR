/**
 * 二维码详细表
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_qrcode', {
        infoId: { type: Sequelize.INTEGER, field: 'infoId', comment: '信息表的主键ID' },
        qrcode: { type: Sequelize.STRING, field: 'qrcode', comment: '加密后的二维码编号' },
        init_qrcode: { type: Sequelize.STRING, field: 'init_qrcode', comment: '原始的二维码编号 vr_20170513215112_0001' },
        crypto_key: { type: Sequelize.STRING, field: 'crypto_key', comment: '当前加密和解密的KEY值' },
        crypto_iv: { type: Sequelize.STRING, field: 'crypto_iv', comment: '当前加密和解密的IV值' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '是否被使用', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};