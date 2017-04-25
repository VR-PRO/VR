/**
 * 设备管理模块
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_order', {
        agentId: { type: Sequelize.INTEGER, field: 'agentId', comment: '代理商ID' },
        hotelId: { type: Sequelize.INTEGER, field: 'hotelId', comment: '酒店ID' },
        wxName: { type: Sequelize.STRING, field: 'wxName', comment: '微信名称' },
        openId: { type: Sequelize.STRING, field: 'openId', comment: '微信的openId' },
        movieName: { type: Sequelize.STRING, field: 'movieName', comment: '电影名称' },
        realFee: { type: Sequelize.DECIMAL(10, 2), field: 'realFee', comment: '实收金额' },
        devCode: { type: Sequelize.STRING, field: 'devCode', comment: '设备号码' },
        addr: { type: Sequelize.STRING, field: 'addr', comment: '消费地点' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        payStatus: { type: Sequelize.STRING, field: 'payStatus', comment: '支付状态' },
        orderStatus: { type: Sequelize.STRING, field: 'orderStatus', comment: '支付状态' },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};