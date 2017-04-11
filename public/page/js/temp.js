/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('TempController', TempController);

    TempController.$inject = ['$scope'];

    function TempController($scope) {
        var tempVm = this,
        curIndex = -1,
        urls = {};

        tempVm.loading = false;
        tempVm.directives = {

        };
        tempVm.temp = {
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