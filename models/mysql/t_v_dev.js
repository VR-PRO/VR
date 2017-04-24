/**
 * 设备管理模块
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_dev', {
        roomNum: { type: Sequelize.STRING, field: 'roomNum', comment: '房间号' },
        agentId: { type: Sequelize.INTEGER, field: 'agentId', comment: '供应商ID' },
        hotelId: { type: Sequelize.INTEGER, field: 'hotelId', comment: '酒店ID' },
        devCode: { type: Sequelize.STRING, field: 'devCode', comment: '设备号码' },
        qrCodes: { type: Sequelize.STRING, field: 'qrCodes', comment: '二维码编号集合' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};