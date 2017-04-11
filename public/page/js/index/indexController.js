(function() {
    angular
        .module("vrApp")
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope'];

    function IndexController($scope) {
        var indexVm = this,
            curIndex = -1,
            dateTimeType = 'curmonth',
            urls = {};

        var _t = vrHelper.getDateTimeByType(dateTimeType);


        indexVm.loading = false;

        indexVm.directives = {
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
        indexVm.page = {
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