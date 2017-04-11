/**
 * 模块:过滤器
 * 创建时间:2016-09-22
 * *****变更记录*******
 */
(function() {
    'use strict';
    angular
        .module("vrApp")
        .filter('sexTypeFilter', sexTypeFilter) //sex Filter
    ;

    sexTypeFilter.$inject = ['$sce'];


    function sexTypeFilter($sce) {
        return function(sex) {
            var sexType = '';
            if (sex) {
                sexType = '其他';
                switch (sex + '') {
                    case "1":
                        { sexType = '受'; }
                        break;
                    case "2":
                        { sexType = '攻'; }
                        break;
                    case "3":
                        {
                            sexType = '攻受皆可';
                        }
                        break;
                }
            }
            return sexType;
        };
    }


})();