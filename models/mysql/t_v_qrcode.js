/**
 * 二维码详细表
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_qrcode', {
        infoId: { type: Sequelize.INTEGER, field: 'infoId', comment: '信息表的主键ID' },
        qrcode: { type: Sequelize.STRING, field: 'qrcode', comment: '二维码编号' },
        devcode: { type: Sequelize.STRING, field: 'devcode', comment: '已经绑定的设备号', defaultValue: null },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '是否被使用 0:未使用 1:已使用', defaultValue: 0 }
    }, {
        freezeTableName: true
    });
};