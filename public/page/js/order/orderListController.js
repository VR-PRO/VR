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
            urls = {
                list: '/order/list',
            };

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
                    opt.init();
                }
            }
        };
        orderListVm.page = {
            vm: {
                top: {
                    key: '',
                    totalFee: 0
                },
                list: [],
            },
            event: {
                rearch: function() {
                    opt.init();
                }
            }
        };

        orderListVm.pageCfg = {
            isInit: false,
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [15, 20, 30],
            rememberPerPage: 'orderListVm.pageCfg.cookie.key',
            onChange: function() {
                if (orderListVm.pageCfg.totalItems === 0) { return false; }
                opt.list();
            },
            onInit: function() {
                orderListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };

        var opt = {
            list: function() {
                var st = orderListVm.directives.timeOptCfg.vm.st + ' 00:00:01';
                var et = orderListVm.directives.timeOptCfg.vm.et + ' 23:59:59';
                var key = _.trim(orderListVm.page.vm.top.key);
                orderListVm.loading = true;
                vrHelper.jqAjax(urls.list, {
                    st: st,
                    et: et,
                    key: key,
                    pageNo: orderListVm.pageCfg.currentPage,
                    pageSize: orderListVm.pageCfg.itemsPerPage,
                }, function(res) {
                    var data = res.data;
                    var list = data.list || [];
                    var totalFee = 0;
                    angular.forEach(list, function(item) {
                        var created = item.created;
                        totalFee = totalFee + Number(item.realFee);
                        item.st = moment(created).format('YYYY-MM-DD HH:mm:ss');
                        item.et = moment(created).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                    });
                    orderListVm.page.vm.top.totalFee = totalFee;
                    orderListVm.page.vm.list = list;
                    orderListVm.pageCfg.totalItems = data.totalItems || 0;
                    orderListVm.loading = false;
                    $scope.$apply();
                }, function() {
                    orderListVm.loading = false;
                    $scope.$apply();
                }, 'POST', true, 'indexLoadId');
            },
            init: function() {
                orderListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };
    }
})();