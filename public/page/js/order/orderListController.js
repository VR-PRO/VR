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
                agent_list_all: '/agent/list/all',
                hotel_list_agentId: '/hotel/list/agentId',
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
                    agentIds: [], //orderListVm.page.vm.top.agentIds
                    agentList: [], //orderListVm.page.vm.top.agentList
                    hotelIds: [], //orderListVm.page.vm.top.hotelIds
                    hotelList: [], //orderListVm.page.vm.top.hotelList
                    key: '',
                    totalFee: 0
                },
                list: [],
                userType: ''
            },
            event: {
                hotelItemClick: function(event, index) { //orderListVm.page.event.hotelItemClick
                    var cur = orderListVm.page.vm.top.hotelList[index];
                    if (cur) {
                        if (cur.hotelId == 'all') {
                            var _index = orderListVm.page.vm.top.hotelIds.indexOf(cur.hotelId);
                            if (_index == -1) {
                                var temp = [];
                                temp.push('all');
                                _.forEach(orderListVm.page.vm.top.hotelList, function(item) {
                                    temp.push(item.hotelId);
                                });
                                orderListVm.page.vm.top.hotelIds = temp;
                            } else {
                                orderListVm.page.vm.top.hotelIds = [];
                            }
                        } else {
                            var _index = orderListVm.page.vm.top.hotelIds.indexOf(cur.hotelId);
                            if (_index == -1) {
                                orderListVm.page.vm.top.hotelIds.push(cur.hotelId);

                                var hotelListLen = orderListVm.page.vm.top.hotelList.length;
                                var hotelIdsLen = orderListVm.page.vm.top.hotelIds.length;
                                if (hotelListLen == hotelIdsLen + 1) {
                                    var allIndex = orderListVm.page.vm.top.hotelIds.indexOf('all');
                                    if (allIndex == -1) {
                                        orderListVm.page.vm.top.hotelIds.push('all');
                                    }
                                }
                            } else {
                                orderListVm.page.vm.top.hotelIds.splice(_index, 1);
                                var hotelListLen = orderListVm.page.vm.top.hotelList.length;
                                var hotelIdsLen = orderListVm.page.vm.top.hotelIds.length;
                                if (hotelListLen != hotelIdsLen) {
                                    var allIndex = orderListVm.page.vm.top.hotelIds.indexOf('all');
                                    if (allIndex >= 0) {
                                        orderListVm.page.vm.top.hotelIds.splice(allIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                },
                agentItemClick: function(event, index) { //orderListVm.page.event.agentItemClick
                    var cur = orderListVm.page.vm.top.agentList[index];
                    if (cur) {
                        if (cur.agentId == 'all') {
                            var _index = orderListVm.page.vm.top.agentIds.indexOf(cur.agentId);
                            if (_index == -1) {
                                var temp = [];
                                temp.push('all');
                                _.forEach(orderListVm.page.vm.top.agentList, function(item) {
                                    temp.push(item.agentId);
                                });
                                orderListVm.page.vm.top.agentIds = temp;
                            } else {
                                orderListVm.page.vm.top.agentIds = [];
                            }
                        } else {
                            var _index = orderListVm.page.vm.top.agentIds.indexOf(cur.agentId);
                            if (_index == -1) {
                                orderListVm.page.vm.top.agentIds.push(cur.agentId);

                                var agentListLen = orderListVm.page.vm.top.agentList.length;
                                var agentIdsLen = orderListVm.page.vm.top.agentIds.length;
                                if (agentListLen == agentIdsLen + 1) {
                                    var allIndex = orderListVm.page.vm.top.agentIds.indexOf('all');
                                    if (allIndex == -1) {
                                        orderListVm.page.vm.top.agentIds.push('all');
                                    }
                                }
                            } else {
                                orderListVm.page.vm.top.agentIds.splice(_index, 1);
                                var agentListLen = orderListVm.page.vm.top.agentList.length;
                                var agentIdsLen = orderListVm.page.vm.top.agentIds.length;
                                if (agentListLen != agentIdsLen) {
                                    var allIndex = orderListVm.page.vm.top.agentIds.indexOf('all');
                                    if (allIndex >= 0) {
                                        orderListVm.page.vm.top.agentIds.splice(allIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                    var len = orderListVm.page.vm.top.agentIds.length;
                    if (len == 1 && orderListVm.page.vm.top.agentIds.indexOf('all') == -1) {
                        opt.hotelList();
                    } else {
                        orderListVm.page.vm.top.hotelIds = [];
                        orderListVm.page.vm.top.hotelList = [];
                    }
                },
                filterSubmit: function() { //orderListVm.page.event.filterSubmit
                    $("#divOrderFilter").modal('hide');
                    orderListVm.pageCfg.currentPage = 1;
                    opt.list();
                },
                rearch: function() {
                    orderListVm.pageCfg.currentPage = 1;
                    opt.list();
                },
                viewFilterModal: function() { //orderListVm.page.event.viewFilterModal
                    if (orderListVm.page.vm.userType == 'USER_TYPE_ADMIN') {
                        opt.agentList();
                    } else if (orderListVm.page.vm.userType == 'USER_TYPE_AGENT') {
                        opt.hotelList();
                    }
                    $('#divOrderFilter').modal('show');
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
                opt.init();
            }
        };

        var opt = {
            hotelList: function() {
                var param = [];
                if (orderListVm.page.vm.top.agentIds.length == 1) {
                    param.push('agentId=' + orderListVm.page.vm.top.agentIds[0]);
                }
                vrHelper.jqAjax(urls.hotel_list_agentId, param.join('&'), function(json) {
                    var list = json.data || [];
                    var temp = [];
                    temp.push({ text: '全部', hotelId: 'all' });
                    _.forEach(list, function(item) {
                        temp.push({ text: item.name, hotelId: item.id });
                    });
                    orderListVm.page.vm.top.hotelList = temp;
                    $scope.$apply();
                }, function() {}, 'POST', false, 'divFilterModalLoad');
            },
            agentList: function() {
                vrHelper.jqAjax(urls.agent_list_all, '', function(json) {
                    var list = json.data || [];
                    var temp = [];
                    temp.push({ text: '全部', agentId: 'all' });
                    _.forEach(list, function(item) {
                        temp.push({ text: item.name, agentId: item.id });
                    });
                    orderListVm.page.vm.top.agentList = temp;
                    $scope.$apply();
                }, function() {}, 'POST', false, 'divFilterModalLoad');
            },
            list: function() {
                var st = orderListVm.directives.timeOptCfg.vm.st + ' 00:00:01';
                var et = orderListVm.directives.timeOptCfg.vm.et + ' 23:59:59';
                var agentIds = orderListVm.page.vm.top.agentIds;
                var hotelIds = orderListVm.page.vm.top.hotelIds;

                var key = _.trim(orderListVm.page.vm.top.key);

                var param = {
                    pageNo: orderListVm.pageCfg.currentPage,
                    pageSize: orderListVm.pageCfg.itemsPerPage,
                };
                if (st && et) {
                    param.st = st;
                    param.et = et;
                }
                if (key) {
                    param.key = key;
                }
                if (agentIds && agentIds.length > 0) {
                    //清理all的值
                    var tempArr = [];
                    _.forEach(agentIds, function(item) {
                        if (item != 'all') {
                            tempArr.push(item);
                        }
                    });
                    param.agentId = tempArr;
                }
                if (hotelIds && hotelIds.length > 0) {
                    var tempArr = [];
                    _.forEach(hotelIds, function(item) {
                        if (item != 'all') {
                            tempArr.push(item);
                        }
                    });
                    param.hotelId = tempArr;
                }

                orderListVm.loading = true;
                vrHelper.jqAjax(urls.list, param,
                    function(res) {
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
                    },
                    function() {
                        orderListVm.loading = false;
                        $scope.$apply();
                    }, 'POST', true, 'indexLoadId');
            },
            init: function() {
                var inputUserType = $('#inputUserType').val();
                orderListVm.page.vm.userType = inputUserType;

                orderListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };
    }
})();