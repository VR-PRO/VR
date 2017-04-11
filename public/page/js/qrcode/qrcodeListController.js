/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('QrcodeListController', QrcodeListController);

    QrcodeListController.$inject = ['$scope'];

    function QrcodeListController($scope) {
        var qrcodeListVm = this,
            curIndex = -1,
            urls = {};

        qrcodeListVm.loading = false;
        qrcodeListVm.page = {
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