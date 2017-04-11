/**
 * 设备管理模块
 */
module.exports  = function (sequelize, Sequelize) {
    return sequelize.define('t_v_dev', {
        roomNum: { type: Sequelize.STRING, field: 'roomNum' ,comment:'房间号'},
        devCode: { type: Sequelize.STRING, field: 'devCode' ,comment:'设备号'},
        created: { type: Sequelize.DATE, field: 'created' ,comment:'创建时间'},
        status: { type: Sequelize.BOOLEAN, field: 'status' ,comment:'状态'}
    }, {
        freezeTableName: true
    });
};
