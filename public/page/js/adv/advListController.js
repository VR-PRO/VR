/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('AdvListController', AdvListController);

    AdvListController.$inject = ['$scope'];

    function AdvListController($scope) {
        var advListVm = this,
            curIndex = -1,
            urls = {};

        advListVm.loading = false;

        advListVm.page = {
            vm: {

            },
            event: {

            }
        };

        var opt = {
            init: function() {

            }
        };
        opt.init();
    }
})();