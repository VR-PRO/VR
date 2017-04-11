/**
 * 代理商-酒店管理
 */

module.exports  = function (sequelize, Sequelize) {
    return sequelize.define('t_v_agent_hotel', {
        agentId: { type: Sequelize.INTEGER, field: 'agentId' ,comment:'代理商ID'},
        hotelId: { type: Sequelize.INTEGER, field: 'hotelId' ,comment:'酒店ID'},
        created: { type: Sequelize.DATE, field: 'created' ,comment:'创建时间'},
        status: { type: Sequelize.BOOLEAN, field: 'status' ,comment:'状态'},
    }, {
        freezeTableName: true
    });
};
