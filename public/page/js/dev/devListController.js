/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('DevListController', DevListController);

    DevListController.$inject = ['$scope', '$location'];

    function DevListController($scope, $location) {
        var devListVm = this,
            curIndex = -1,
            agentId = 0,
            hotelId = 0,
            urls = {
                list: '/dev/list',
                save: '/dev/save',
                check: '/dev/check',
                agent_list_all: '/agent/list/all',
                hotel_list_agentId: '/hotel/list/agentId',
            };
        devListVm.loading = false;

        if ($location.$$search && $location.$$search.agentId) {
            agentId = $location.$$search.agentId;
        }

        if ($location.$$search && $location.$$search.hotelId) {
            hotelId = $location.$$search.hotelId;
        }


        var opt = {
            saveDevModalView: function() {
                devListVm.page.vm.save.roomNum = '';
                devListVm.page.vm.save.devCode = '';
                devListVm.page.vm.save.qrcodeList = [{ qrcode: '' }];
                $('#divDevSaveModal').modal('show');
            },
            qrcodeCreate: function() {
                if (devListVm.page.vm.save.qrcodeList.length >= 5) {
                    message.error('最多绑定5个设备.');
                    return false;
                }
                var errors = [];
                var tempArr = [];
                _.forEach(devListVm.page.vm.save.qrcodeList, function(item, index) {
                    if (item.qrcode == '') {
                        errors.push('第' + (index + 1) + '个二维码编号不可为空.');
                    }
                    if (tempArr.indexOf(item.qrcode) == -1) {
                        tempArr.push(item.qrcode);
                    }
                });
                if (errors.length > 0) {
                    message.error(errors.join('<br/>'));
                    return false;
                }
                if (tempArr.length != devListVm.page.vm.save.qrcodeList.length) {
                    message.error('有重复的二维码信息.');
                    return false;
                }
                devListVm.page.vm.save.qrcodeList.push({ qrcode: '' });
            },
            qrcodeRemove: function(index) {
                var cur = devListVm.page.vm.save.qrcodeList[index];
                if (cur) {
                    devListVm.page.vm.save.qrcodeList.splice(index, 1);
                }
            },
            save: function() {
                var roomNum = _.trim(devListVm.page.vm.save.roomNum);
                if (roomNum == '') {
                    message.error('房间号不可为空.');
                    return false;
                }

                var existsArr = [];
                var errors = [];
                _.forEach(devListVm.page.vm.save.qrcodeList, function(item, index) {
                    if (item.qrcode == '') {
                        errors.push('第' + (index + 1) + '个二维码编号不可为空.');
                    }
                    if (existsArr.indexOf(item.qrcode) == -1) {
                        existsArr.push(item.qrcode);
                    }
                });
                if (errors.length > 0) {
                    message.error(errors.join('<br/>'));
                    return false;
                }
                //是否有重复的二维码
                if (existsArr.length != devListVm.page.vm.save.qrcodeList.length) {
                    message.error('有重复的二维码信息.');
                    return false;
                }

                var devCode = _.trim(devListVm.page.vm.save.devCode);
                if (devCode == '') {
                    message.error('设备号不可为空.');
                    return false;
                }
                opt.check(function() {
                    var data = {
                        roomNum: roomNum,
                        qrcodeList: devListVm.page.vm.save.qrcodeList,
                        devCode: devCode
                    };
                    devListVm.loading = true;
                    vrHelper.jqAjax(urls.save, data, function(res) {
                        message.success('操作成功.');
                        $('#divDevSaveModal').modal('hide');
                        devListVm.loading = false;
                        devListVm.pageCfg.currentPage = 1;
                        opt.list();
                        $scope.$apply();
                    }, function() {
                        devListVm.loading = false;
                        $scope.$apply();
                    }, 'POST');
                });
            },
            list: function() {

                var key = _.trim(devListVm.page.vm.key);
                var data = {
                    pageNo: devListVm.pageCfg.currentPage,
                    pageSize: devListVm.pageCfg.itemsPerPage
                };
                if (key) {
                    data.key = key;
                }

                var agentIds = devListVm.page.vm.agentIds;
                var hotelIds = devListVm.page.vm.hotelIds;
                if (agentIds && agentIds.length > 0) {
                    var tempArr = [];
                    _.forEach(agentIds, function(item) {
                        if (item != 'all') {
                            tempArr.push(item);
                        }
                    });
                    data.agentId = tempArr;
                }
                if (hotelIds && hotelIds.length > 0) {
                    var tempArr = [];
                    _.forEach(hotelIds, function(item) {
                        if (item != 'all') {
                            tempArr.push(item);
                        }
                    });
                    data.hotelId = tempArr;
                }
                vrHelper.jqAjax(urls.list, data, function(res) {
                    var data = res.data;
                    var list = data.list || [];

                    _.forEach(list, function(item) {
                        item.created = moment(item.created).format('YYYY-MM-DD HH:mm');
                    });

                    devListVm.page.vm.list = list;
                    devListVm.pageCfg.totalItems = data.totalItems || 0;

                    devListVm.loading = false;
                    $scope.$apply();
                }, function(err) {
                    devListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'devPageLoadId');
            },
            init: function() {
                var inputUserType = $('#inputUserType').val();
                devListVm.page.vm.userType = inputUserType;

                devListVm.pageCfg.currentPage = 1;
                opt.list();
            },
            rearch: function() {
                devListVm.pageCfg.currentPage = 1;
                opt.list();
            },
            check: function(callback) {
                devListVm.loading = true;
                var devCode = _.trim(devListVm.page.vm.save.devCode);
                var data = {
                    qrcodeList: devListVm.page.vm.save.qrcodeList,
                    devCode: devCode
                };
                vrHelper.jqAjax(urls.check, data, function(res) {
                    if (res.data) {
                        message.error(res.msg.join('<br/>'));
                        devListVm.loading = false;
                        $scope.$apply();
                    } else {
                        callback && callback();
                    }
                }, function() {
                    devListVm.loading = false;
                    $scope.$apply();
                }, 'POST');
            },
            hotelList: function() {
                var param = [];
                if (devListVm.page.vm.agentIds.length == 1) {
                    param.push('agentId=' + devListVm.page.vm.agentIds[0]);
                }
                vrHelper.jqAjax(urls.hotel_list_agentId, param.join('&'), function(json) {
                    var list = json.data || [];
                    var temp = [];
                    temp.push({ text: '全部', hotelId: 'all' });
                    _.forEach(list, function(item) {
                        temp.push({ text: item.name, hotelId: item.id });
                    });
                    devListVm.page.vm.hotelList = temp;
                    $scope.$apply();
                }, function() {}, 'POST', false, 'divInfoFliterLoad');
            },
            agentList: function() {
                vrHelper.jqAjax(urls.agent_list_all, '', function(json) {
                    var list = json.data || [];
                    var temp = [];
                    temp.push({ text: '全部', agentId: 'all' });
                    _.forEach(list, function(item) {
                        temp.push({ text: item.name, agentId: item.id });
                    });
                    devListVm.page.vm.agentList = temp;
                    $scope.$apply();
                }, function() {}, 'POST', false, 'divInfoFliterLoad');
            },
            filterSubmit: function() {
                $("#divInfoFliter").modal('hide');
                devListVm.pageCfg.currentPage = 1;
                opt.list();
            },
            viewFliterModal: function() {
                if (devListVm.page.vm.userType == 'USER_TYPE_ADMIN') {
                    opt.agentList();
                } else if (devListVm.page.vm.userType == 'USER_TYPE_AGENT') {
                    opt.hotelList();
                }
                $('#divInfoFliter').modal('show');
            }
        };

        devListVm.page = { //devListVm.page.event.viewFliterModal
            vm: {
                userType: '',
                agentIds: [], //devListVm.page.vm.agentIds
                agentList: [], //devListVm.page.vm.agentList
                hotelIds: [], //devListVm.page.vm.hotelIds
                hotelList: [], //devListVm.page.vm.hotelList
                list: [],
                key: '', //devListVm.page.vm.key
                save: {
                    roomNum: '', //devListVm.page.vm.save
                    devCode: '',
                    qrcodeList: [], //
                }
            },
            event: {
                saveDevModalView: opt.saveDevModalView,
                qrcodeCreate: opt.qrcodeCreate,
                qrcodeRemove: opt.qrcodeRemove,
                save: opt.save,
                rearch: opt.rearch,
                viewFliterModal: opt.viewFliterModal,
                filterSubmit: opt.filterSubmit,
                hotelItemClick: function(event, index) { //devListVm.page.event.hotelItemClick
                    var cur = devListVm.page.vm.hotelList[index];
                    if (cur) {
                        if (cur.hotelId == 'all') {
                            var _index = devListVm.page.vm.hotelIds.indexOf(cur.hotelId);
                            if (_index == -1) {
                                var temp = [];
                                temp.push('all');
                                _.forEach(devListVm.page.vm.hotelList, function(item) {
                                    temp.push(item.hotelId);
                                });
                                devListVm.page.vm.hotelIds = temp;
                            } else {
                                devListVm.page.vm.hotelIds = [];
                            }
                        } else {
                            var _index = devListVm.page.vm.hotelIds.indexOf(cur.hotelId);
                            if (_index == -1) {
                                devListVm.page.vm.hotelIds.push(cur.hotelId);

                                var hotelListLen = devListVm.page.vm.hotelList.length;
                                var hotelIdsLen = devListVm.page.vm.hotelIds.length;
                                if (hotelListLen == hotelIdsLen + 1) {
                                    var allIndex = devListVm.page.vm.hotelIds.indexOf('all');
                                    if (allIndex == -1) {
                                        devListVm.page.vm.hotelIds.push('all');
                                    }
                                }
                            } else {
                                devListVm.page.vm.hotelIds.splice(_index, 1);
                                var hotelListLen = devListVm.page.vm.hotelList.length;
                                var hotelIdsLen = devListVm.page.vm.hotelIds.length;
                                if (hotelListLen != hotelIdsLen) {
                                    var allIndex = devListVm.page.vm.hotelIds.indexOf('all');
                                    if (allIndex >= 0) {
                                        devListVm.page.vm.hotelIds.splice(allIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                },
                agentItemClick: function(event, index) { //devListVm.page.event.agentItemClick
                    var cur = devListVm.page.vm.agentList[index];
                    if (cur) {
                        if (cur.agentId == 'all') {
                            var _index = devListVm.page.vm.agentIds.indexOf(cur.agentId);
                            if (_index == -1) {
                                var temp = [];
                                temp.push('all');
                                _.forEach(devListVm.page.vm.agentList, function(item) {
                                    temp.push(item.agentId);
                                });
                                devListVm.page.vm.agentIds = temp;
                            } else {
                                devListVm.page.vm.agentIds = [];
                            }
                        } else {
                            var _index = devListVm.page.vm.agentIds.indexOf(cur.agentId);
                            if (_index == -1) {
                                devListVm.page.vm.agentIds.push(cur.agentId);

                                var agentListLen = devListVm.page.vm.agentList.length;
                                var agentIdsLen = devListVm.page.vm.agentIds.length;
                                if (agentListLen == agentIdsLen + 1) {
                                    var allIndex = devListVm.page.vm.agentIds.indexOf('all');
                                    if (allIndex == -1) {
                                        devListVm.page.vm.agentIds.push('all');
                                    }
                                }
                            } else {
                                devListVm.page.vm.agentIds.splice(_index, 1);
                                var agentListLen = devListVm.page.vm.agentList.length;
                                var agentIdsLen = devListVm.page.vm.agentIds.length;
                                if (agentListLen != agentIdsLen) {
                                    var allIndex = devListVm.page.vm.agentIds.indexOf('all');
                                    if (allIndex >= 0) {
                                        devListVm.page.vm.agentIds.splice(allIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                    var len = devListVm.page.vm.agentIds.length;
                    if (len == 1 && devListVm.page.vm.agentIds.indexOf('all') == -1) {
                        opt.hotelList();
                    } else {
                        devListVm.page.vm.hotelIds = [];
                        devListVm.page.vm.hotelList = [];
                    }
                },
            }
        };

        devListVm.pageCfg = {
            isInit: false,
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [15, 20, 30],
            rememberPerPage: 'devListVm.pageCfg.cookie.key',
            onChange: function() {
                if (devListVm.pageCfg.totalItems === 0) { return false; }
                opt.list();
            },
            onInit: function() {
                opt.init();

            }
        };
    }
})();