/**
 * Created by mo on 2017/3/25.
 * api调用日志 MongoDB
 */

var mongoose    =  require('mongoose');
var base        =   require('./base');
var Schema      =   mongoose.Schema;
var ObjectId    =   Schema.ObjectId;

var ApiSchema = new Schema({
    api_id:{type:ObjectId},     //
    req_type:{type:String},     //模块区分
    req_url:{type:String},      //请求地址
    req_params:{type:Array},   //请求参数
});
ApiSchema.plugin(base);

mongoose.model('sys_api_log', ApiSchema);