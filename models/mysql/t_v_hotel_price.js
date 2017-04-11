/**
 * 设备对应价格的  1:n
 */
module.exports  = function (sequelize, Sequelize) {
    return sequelize.define('t_v_hotel_price', {
        hoteId: { type: Sequelize.INTEGER, field: 'hoteId' ,comment:'酒店ID'},
        type:{type:Sequelize.INTEGER,field:'type',comment:'价格类型： 1：1小时，2：2小时，3：3小时，4：4小时'},
        price: { type: Sequelize.STRING, field: 'price' ,comment:'type 类型对应的价格'},
        status: { type: Sequelize.BOOLEAN, field: 'status',comment:'状态' }
    }, {
        freezeTableName: true
    });
};
