/**
 * 生成记录表
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_qrcode_info', {
        count: { type: Sequelize.INTEGER, field: 'count', comment: '生成的数量' },
        remark: { type: Sequelize.STRING, field: 'remark', comment: '备注' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};