var sequelize = require('./instance').sequelize();

//表的初始化处理
var User = sequelize.import('./t_v_user.js');

var Adv = sequelize.import('./t_v_adv.js');

var Dev = sequelize.import('./t_v_dev.js');
var DevQrcode = sequelize.import('./t_v_dev_qrcode.js');

var Hotel = sequelize.import('./t_v_hotel.js');

var Agent = sequelize.import('./t_v_agent.js');

var Order = sequelize.import('./t_v_order.js');


// 同步模型到数据库中
sequelize.sync().then(function() {
    User.create({
        mobile: '13478659803',
        pwd: 'JdVa0oOqQAr0ZMdtcTwHrQ==',
        type: 'USER_TYPE_ADMIN'
    });
});

exports.User = User;
exports.Adv = Adv;
exports.Dev = Dev;
exports.DevQrcode = DevQrcode;
exports.Hotel = Hotel;
exports.Agent = Agent;
exports.Order = Order;

exports.sequelize = sequelize;