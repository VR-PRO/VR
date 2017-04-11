/**
 * 广告模块
 * 2014-04-11  -->看设计需要增加remark字段信息
 */
module.exports  = function (sequelize, DataTypes) {
    return sequelize.define('t_v_adv', {
        scope: { type: DataTypes.STRING, field: 'scope',comment:'广告范围'},
        remark:{ type: DataTypes.STRING, field: 'remark',comment:'备注信息'},
        status: { type: DataTypes.BOOLEAN, field: 'status',defaultValue:1,comment:'状态 0：false, 1:true' }
    }, {
        freezeTableName: true
    });
};