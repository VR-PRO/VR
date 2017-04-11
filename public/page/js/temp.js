/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('TempController', TempController);

    TempController.$inject = ['$scope'];

    function TempController($scope) {
        var indexVm = this,
            curIndex = -1,
            dateTimeType = 'curmonth',
            _t = vrHelper.getDateTimeByType(dateTimeType),
            urls = {};

        tempVm.loading = false;
        tempVm.directives = {

        };
        tempVm.page = {
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