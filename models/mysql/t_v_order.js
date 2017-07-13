/**
 * 设备管理模块
 */
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('t_v_order', {
        agentId: { type: Sequelize.INTEGER, field: 'agentId', comment: '代理商ID' },
        hotelId: { type: Sequelize.INTEGER, field: 'hotelId', comment: '酒店ID' },
        wxName: { type: Sequelize.STRING, field: 'wxName', comment: '微信名称' },
        openId: { type: Sequelize.STRING, field: 'openId', comment: '微信的openId' },
        movieKey: { type: Sequelize.STRING, field: 'movieKey', comment: '电影唯一标识' },
        movieName: { type: Sequelize.STRING, field: 'movieName', comment: '电影名称' },
        realFee: { type: Sequelize.DECIMAL(10, 2), field: 'realFee', comment: '实收金额' },
        devCode: { type: Sequelize.STRING, field: 'devCode', comment: '设备号码' },
        addr: { type: Sequelize.STRING, field: 'addr', comment: '消费地点' },
        prepayid: { type: Sequelize.STRING, field: 'prepayid', comment: '预支付交易会话标识' },
        transaction_id: { type: Sequelize.STRING, field: 'transaction_id', comment: '微信支付订单号' },
        out_trade_no: { type: Sequelize.STRING, field: 'out_trade_no', comment: '商户订单号' },
        created: { type: Sequelize.DATE, field: 'created', comment: '创建时间', defaultValue: Sequelize.NOW },
        payStatus: { type: Sequelize.STRING, field: 'payStatus', comment: '支付状态 S_ZFZT_DZF  S_ZFZT_YZF', defaultValue: 'S_ZFZT_DZF' },
        isPlay: { type: Sequelize.BOOLEAN, field: 'isPlay', comment: '是否允许播放该电影,24小时后自动失效。', defaultValue: 0 },
        status: { type: Sequelize.BOOLEAN, field: 'status', comment: '状态', defaultValue: 1 }
    }, {
        freezeTableName: true
    });
};