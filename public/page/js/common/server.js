/**
 * 模块:公共服务js
 * 时间:2016-11-12
 * *****变更记录*******
 * :2016-11-12 新增加 角色列表查询
 */
(function() {
    'use strict';
    angular
        .module("vrApp")
        .service('comRoleListService', comRoleListService)

    var urls = {
        role_list: 'role/list',
    };

    /**
     * 角色集合的读取
     */
    function comRoleListService() {
        var service = { data: {}, query: query };
        return service;

        function query(param, loadId, callback) {
            vr.jqAjax(urls.role_list, param, function(json) {
                callback && callback(json.data);
            }, function() {}, 'GET', false, loadId);
        }
    }


})();