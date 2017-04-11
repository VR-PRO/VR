/**
 * 广告图片表
 */
module.exports  = function (sequelize, DataTypes) {
    return sequelize.define('t_v_adv_img', {
        advId: {type: DataTypes.INTEGER,field: 'advId',comment:'广告表主键ID'},
        imgCode:{ type: DataTypes.STRING, field: 'imgCode' ,comment:'广告表对应的图片名称 ps:七牛云存储前缀'},
        status: { type: DataTypes.BOOLEAN, field: 'status',comment:'状态 0：false, 1:true' }
    }, {
        freezeTableName: true
    });
};
