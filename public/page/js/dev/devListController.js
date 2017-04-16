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
            urls = {};

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
            init: function() {
                opt.list();
            }
        };
        opt.init();

        devListVm.page = { //devListVm.page.vm.list
            vm: {
                list: [],
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
    }
})();