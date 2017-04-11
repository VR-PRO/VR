/**
 * 用户模型
 */
module.exports  = function (sequelize, DataTypes) {
    return sequelize.define('t_v_user', {
        mobile: { type: DataTypes.STRING, field: 'mobile' },
        pwd: { type: DataTypes.STRING, field: 'pwd' },
        type: { type: DataTypes.STRING, field: 'type' },
        status: { type: DataTypes.BOOLEAN, field: 'status' }
    }, {
        freezeTableName: true
    });
};