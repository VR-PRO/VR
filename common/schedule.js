/**
 * 定时任务
 */

var schedule = require('node-schedule');
var Order = require('../proxy/mysql/order');
var moment = require('moment');

exports.clearMovieOrder = function() {

    var rule = new schedule.RecurrenceRule();
    //rule.second = 0; //每分钟的 60秒执行
    rule.minute = 60; //每小时的 60分执行

    schedule.scheduleJob(rule, function() {
        console.log('scheduleRecurrenceRule-run:' + moment().format('YYYY-MM-DD HH:mm:ss'));
        Order.updateIsPlay(function(error, result) {
            if (error) {
                console.error(error);
            }
        });
    });

}

/**
 
使用方法

1：确定时间

    例如：2014年2月14日，15:40执行

    var schedule = require("node-schedule");

    var date = new Date(2014,2,14,15,40,0);

    var j = schedule.scheduleJob(date, function(){

　　　　console.log("执行任务");

　 });

    取消任务

    j.cancel();

 

2：每小时的固定时间

　　例如：每小时的40分钟执行

　　var rule = new schedule.RecurrenceRule();

　　rule.minute = 40;

　　var j = schedule.scheduleJob(rule, function(){

　　　　console.log("执行任务");

　　});

3：一个星期中的某些天的某个时刻执行，

　　例如：周一到周日的20点执行

　　var rule = new schedule.RecurrenceRule();

　　rule.dayOfWeek = [0, new schedule.Range(1, 6)];

　　rule.hour = 20;

　　rule.minute = 0;

　　var j = schedule.scheduleJob(rule, function(){

　　　　console.log("执行任务");

　　});

 4：每秒执行

　　var rule = new schedule.RecurrenceRule();

　　var times = [];

　　for(var i=1; i<60; i++){

　　　　times.push(i);

　　}

　　rule.second = times;

　　var c=0;
　　var j = schedule.scheduleJob(rule, function(){
     　　 c++;
      　　console.log(c);
　　});


 */