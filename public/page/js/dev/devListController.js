/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('DevListController', DevListController);

    DevListController.$inject = ['$scope'];

    function DevListController($scope) {
        var devListVm = this,
            curIndex = -1,
            dateTimeType = 'curmonth',
            _t = vrHelper.getDateTimeByType(dateTimeType),
            urls = {};

        devListVm.loading = false;
        devListVm.directives = {
            timeOptCfg: {
                vm: {
                    timeArr: ['today', 'yestoday', 'curmonth', 'prevmonth', 'other'],
                    curTimeType: dateTimeType,
                    st: _t.st,
                    et: _t.et
                },
                onChange: function() {
                    console.log("dddddddddd");
                }
            }
        };
        devListVm.page = {
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