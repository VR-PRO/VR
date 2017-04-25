(function() {
    angular
        .module("vrApp")
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope'];

    function IndexController($scope) {
        var indexVm = this,
            curIndex = -1,
            dateTimeType = 'curmonth',
            _t = vrHelper.getDateTimeByType(dateTimeType),
            urls = {
                tj: '/index/tj',
                tjList: '/index/tj/list',
            };


        indexVm.loading = false;

        indexVm.directives = { //indexVm.directives.timeOptCfg.vm.st
            timeOptCfg: {
                vm: {
                    timeArr: ['today', 'yestoday', 'curmonth', 'prevmonth', 'other'],
                    curTimeType: dateTimeType,
                    st: _t.st,
                    et: _t.et
                },
                onChange: function() {
                    opt.topTj();
                    opt.list();
                }
            }
        };
        indexVm.page = {
            vm: {
                top: {
                    income: 0, //总收入
                    commission: 0, //分成
                    profit: 0, //利润
                    devCnt: 0, //设备数量
                },
                list: []
            },
            event: {

            }
        };

        var opt = {
            topTj: function() {
                var st = indexVm.directives.timeOptCfg.vm.st + ' 00：00：01';
                var et = indexVm.directives.timeOptCfg.vm.et + ' 23:59:59';

                vrHelper.jqAjax(urls.tj, { st: st, et: et }, function(json) {
                    var data = json.data;
                    var len = data.length;
                    if (len > 0) {
                        indexVm.page.vm.top.income = Number(data[0].income || 0);
                        indexVm.page.vm.top.commission = Number(data[0].commission || 0);
                        indexVm.page.vm.top.profit = Number(data[0].income) - Number(data[0].commission);
                        indexVm.page.vm.top.devCnt = data[0].devCnt || 0;
                    } else {
                        indexVm.page.vm.top.income = 0;
                        indexVm.page.vm.top.commission = 0;
                        indexVm.page.vm.top.profit = 0;
                        indexVm.page.vm.top.devCnt = 0;
                    }
                    $scope.$apply();
                }, function() {}, 'POST', true, 'indexLoadId');
            },
            list: function() {
                var st = indexVm.directives.timeOptCfg.vm.st + ' 00：00：01';
                var et = indexVm.directives.timeOptCfg.vm.et + ' 23:59:59';

                vrHelper.jqAjax(urls.tjList, { st: st, et: et }, function(res) {
                    var data = res.data;
                    indexVm.page.vm.list = data;
                    $scope.$apply();
                }, function() {}, 'POST', true, 'indexLoadId');
            },
            init: function() {
                opt.topTj();
                opt.list();
            }
        };
        opt.init();
    }
})();