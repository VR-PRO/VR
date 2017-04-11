/**
 * 广告管理 - service
 */
var models = require('../../models/mysql');

var Adv = models.Adv;
var AdvImg = models.AdvImg;

exports.save = function (scope,imgList,callback) {
    return models.sequelize.transaction(function (t) {
        return Adv.create({scope:scope},{transaction: t}).then(function (adv) {
            var tempCommitArr = [];
            _.forEach(imgList,function (img) {
              tempCommitArr.push({imgCode:img.imgCode,status:1,advId:adv.id});
            });
           return AdvImg.bulkCreate(tempCommitArr,{transaction: t});
        });
    }).then(function (result) {
        callback(null,result);
    }).catch(function (err) {
        callback(err,null);
    });
}

