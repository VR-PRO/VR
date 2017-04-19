/**
 * 模块:过滤器
 * 创建时间:2016-09-22
 * *****变更记录*******
 */
(function() {
    'use strict';
    angular
        .module("vrApp")
        .filter('qnImgUrlFliter', qnImgUrlFliter) //sex Filter
    ;

    qnImgUrlFliter.$inject = ['$sce'];


    function qnImgUrlFliter($sce) {
        return function(imgCode) {
            var imgUrl = '';
            if (imgCode) {
                imgUrl = vrHelper.qnDomain + imgCode;
            }
            return imgUrl;
        };
    }

})();