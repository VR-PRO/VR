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
            urls = {
                list: '/dev/list',
                save: '/dev/save',
                check: '/dev/check',
                agentList: '',
                hotelList: '',
            };
        devListVm.loading = false;

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
                _.forEach(devListVm.page.vm.save.qrcodeList, function(item, index) {
                    if (item.qrcode == '') {
                        errors.push('第' + (index + 1) + '个二维码编号不可为空.');
                    }
                });
                if (errors.length > 0) {
                    message.error(errors.join('<br/>'));
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


                var errors = [];
                _.forEach(devListVm.page.vm.save.qrcodeList, function(item, index) {
                    if (item.qrcode == '') {
                        errors.push('第' + (index + 1) + '个二维码编号不可为空.');
                    }
                });
                if (errors.length > 0) {
                    message.error(errors.join('<br/>'));
                    return false;
                }
                //是否有重复的二维码
                var existsArr = [];
                _.forEach(devListVm.page.vm.save.qrcodeList, function(item, index) {
                    if (existsArr.indexOf(item.qrcode) >= 0) {
                        existsArr.push('二维码重复');
                    }
                });
                if (existsArr.length > 0) {
                    message.error('二维码有重复.');
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
            agentList: function() {
                vrHelper.jqAjax(urls.agentList, data, function(res) {
                    var data = res.data;
                    var tempArr = [];
                    tempArr.push({ txt: '全部', id: '' });
                    angular.forEach(data, function(item) {
                        tempArr.puhs();
                    });
                    devListVm.page.vm.agentList = tempArr;
                    devListVm.loading = false;
                    $scope.$apply();
                }, function(err) {
                    devListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'devPageLoadId');
            },
            hotelList: function() {

            },
            viewFliterModal: function() {
                //$('#divInfoFliter').modal('show');
            }
        };

        devListVm.page = { //devListVm.page.event.rearch
            vm: {
                agentList: [],
                hotelList: [],
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
                viewFliterModal: opt.viewFliterModal
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
                devListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };
    }
})();