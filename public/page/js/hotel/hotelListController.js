/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('HotelListController', HotelListController);

    HotelListController.$inject = ['$scope'];

    function HotelListController($scope) {
        var hotelListVm = this,
            curIndex = -1,
            urls = {};

        hotelListVm.loading = false;
        hotelListVm.page = {
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