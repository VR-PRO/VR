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
                list: '/dev/list'
            };

        devListVm.loading = false;



        var opt = {
            saveDevModalView: function() {
                devListVm.page.vm.save.roomNum = '';
                devListVm.page.vm.save.devCode = '';
                devListVm.page.vm.save.qrcodeList = [{ qrcode: '' }];
                $('#divDevSaveModal').modal('show');
            },
            qrcodeCreate: function() { //devListVm.page.event.qrcodeCreate
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

                var devCode = _.trim(devListVm.page.vm.save.devCode);
                if (devCode == '') {
                    message.error('设备号不可为空.');
                    return false;
                }

                //后台保存
                var data = {
                    roomNum: roomNum,
                    qrcodeList: devListVm.page.vm.save.qrcodeList,
                    devCode: devCode
                };
                devListVm.loading = true;
                vrHelper.jqAjax('/dev/save', data, function(res) {
                    message.success('操作成功.');
                    $('#divDevSaveModal').modal('hide');
                    devListVm.loading = false;
                    $scope.$apply();
                }, function() {
                    devListVm.loading = false;
                    $scope.$apply();
                }, 'POST');
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
                    var list = data.list;

                    devListVm.page.vm.list = list || [];
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
            }
        };

        devListVm.page = { //devListVm.page.vm.list
            vm: {
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
                save: opt.save
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