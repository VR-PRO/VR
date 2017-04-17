/**
 * 酒店管理
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_hotel', {
        name: { type: Sequelize.STRING, field: 'name', comment: '名称' },
        mobile: { type: Sequelize.STRING, field: 'mobile', comment: '手机号' },
        rate: { type: Sequelize.STRING, field: 'rate', comment: '分成比例' },
        pid: { type: Sequelize.INTEGER, field: 'pid', comment: '省ID' },
        cid: { type: Sequelize.INTEGER, field: 'cid', comment: '城市ID' },
        addr: { type: Sequelize.TEXT, field: 'addr', comment: '详细地址' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 },
        remark: { type: Sequelize.TEXT, field: 'remark', comment: '备注信息' },
    }, {
        freezeTableName: true
    });
};