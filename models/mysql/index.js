
var sequelize   =   require('./instance').sequelize();

//表的初始化处理
var User = sequelize.import('./t_v_user.js');

//var Order = sequelize.import('./t_v_order.js');

var Adv = sequelize.import('./t_v_adv.js');
var AdvImg = sequelize.import('./t_v_adv_img.js');

var Dev = sequelize.import('./t_v_dev.js');
var DevQrcode = sequelize.import('./t_v_dev_qrcode.js');

var Hotel = sequelize.import('./t_v_hotel.js');
var HotelPrice = sequelize.import('./t_v_hotel_price.js');

var Agent = sequelize.import('./t_v_agent.js');
var AgentHotel = sequelize.import('./t_v_agent_hotel.js');

// 建立模型之间的关系
Dev.hasMany(DevQrcode, {foreignKey:'devId', targetKey:'id', as:'DevQrcode'});
Adv.hasMany(AdvImg, {foreignKey:'advId', targetKey:'id',as:'AdvImg'});
Hotel.hasMany(HotelPrice, {foreignKey:'hoteId', targetKey:'id',as:'HotelPrice'});
Agent.hasMany(AgentHotel, {foreignKey:'agentId', targetKey:'id',as:'HotelPrice'});

// 同步模型到数据库中
sequelize.sync();

exports.User = User;
exports.Adv = Adv;
exports.AdvImg = AdvImg;
exports.Dev = Dev;
exports.DevQrcode = DevQrcode;
exports.Hotel = Hotel;
exports.HotelPrice = HotelPrice;
exports.Agent = Agent;
exports.AgentHotel = AgentHotel;
//exports.Order = Order;


exports.sequelize = sequelize;