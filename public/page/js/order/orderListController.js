/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('OrderListController', OrderListController);

    OrderListController.$inject = ['$scope'];

    function OrderListController($scope) {
        var orderListVm = this,
            curIndex = -1,
            dateTimeType = 'curmonth',
            _t = vrHelper.getDateTimeByType(dateTimeType),
            urls = {};

        orderListVm.loading = false;
        orderListVm.directives = {
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
        orderListVm.page = {
            vm: {
                list: [],

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