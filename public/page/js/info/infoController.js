/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('InfoController', InfoController);

    InfoController.$inject = ['$scope'];

    function InfoController($scope) {
        var infoVm = this,
            curIndex = -1,
            urls = {};

        infoVm.loading = false;
        infoVm.page = {
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