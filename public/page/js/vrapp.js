/**
 * 描述:项目的主入口文件
 * 时间:2016-11-09
 * *****变更记录*******
 *
 */
/**
 * app模块定义
 */
var vrApp = angular.module("vrApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize"]);
/**
 * oc.lazyLoad  
 */
vrApp.config(['$ocLazyLoadProvider', '$httpProvider', function($ocLazyLoadProvider, $httpProvider) {
    $ocLazyLoadProvider.config({});
    if (!$httpProvider.defaults.headers.get) { $httpProvider.defaults.headers.get = {}; }
    // 禁用 IE AJAX 请求缓存
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

/**
 * 网页顶部Controller
 */
vrApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader();
    });
}]);

/**
 * 左侧导航条的Controller
 */
vrApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar();
    });
}]);
/* Setup Layout Part - Quick Sidebar */
vrApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() { QuickSidebar.init(); }, 2000);
    });
}]);
/* Setup App Main Controller */
vrApp.controller('AppController', ['$scope', '$rootScope', '$state', '$sce', function($scope, $rootScope, $state, $sce) {
    var vrApp = this;

    $scope.$on('$viewContentLoaded', function() {

    });
}]);

/**
 * 网页底部的处理--->考虑是否删除
 */
vrApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() { Layout.initFooter(); });
}]);
/**
 * 初始化设定 And run the app
 */
vrApp.run(["$rootScope", "$state", "$window", function($rootScope, $state, $window) {
    $rootScope.$state = $state;

    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    function locationChangeSuccess(event, newUrl, currentUrl) {
        event.preventDefault();
        if ($state.current && $state.current.data) {
            if (currentUrl.indexOf($state.current.data.pageFlag) >= 0 && newUrl.indexOf($state.current.data.pageFlag) >= 0 && newUrl != currentUrl) {
                $window.location.reload();
            }
        }
    }
}]);

/**
 * 网页路由的处理
 */
vrApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    /**
     * 默认跳转的地址
     */
    $urlRouterProvider.otherwise("/index.html");
    /**
     * 页面路由的控制
     */

    $stateProvider
        .state('index', { //这个位置必须是唯一的定义
            url: "/index.html", //路由请求地址
            templateUrl: "vr_index.html", //路由的模板请求地址,action的地址
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'vrApp',
                        files: [
                            vrHelper.staticPer + '/index/indexController.js'
                        ]
                    }]);
                }]
            }
        });

}]);