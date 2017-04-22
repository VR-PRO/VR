/**
 * 设备对应的二维码编号 1:n
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_dev_qrcode', {
        devId: { type: Sequelize.INTEGER, field: 'devId', comment: '设备ID' },
        qrCode: { type: Sequelize.STRING, field: 'qrCode', comment: '二维码编号' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};