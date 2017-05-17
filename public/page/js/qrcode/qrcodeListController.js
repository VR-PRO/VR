/**
 * 描述:js模板
 * https://my.oschina.net/comfiger/blog/368200
 */
(function() {
    angular
        .module("vrApp")
        .controller('QrcodeListController', QrcodeListController);

    QrcodeListController.$inject = ['$scope'];

    function QrcodeListController($scope) {
        var qrcodeListVm = this,
            curIndex = -1,
            urls = {
                qrinfo_list: '/qrcode/info/list',
                qrinfo_save: '/qrcode/info/save',
                qrcode_list: '/qrcode/list',
            };

        qrcodeListVm.loading = false;

        var opt = {
            save: function() {
                var num = _.trim(qrcodeListVm.page.vm.num);
                if (!vrHelper.validate.number(num)) {
                    message.error("数量格式不正确.");
                    return false;
                }
                if (num == 0) {
                    message.error("数量不可为零");
                    return false;
                }
                var remark = _.trim(qrcodeListVm.page.vm.remark);
                qrcodeListVm.loading = true;
                vrHelper.jqAjax(urls.qrinfo_save, { count: num, remark: remark },
                    function(res) {
                        message.success('操作成功.');
                        qrcodeListVm.loading = false;
                        $("#divQrSaveModal").modal("hide");
                        opt.list();
                        $scope.$apply();
                    },
                    function() {
                        qrcodeListVm.loading = false;
                        $scope.$apply();
                    }, 'POST', true, 'divQrSaveModalLoad');

            },
            viewSaveModal: function() {
                qrcodeListVm.page.num = 0;
                $("#divQrSaveModal").modal("show");
            },
            init: function() {
                opt.list();
            },
            list: function() {
                qrcodeListVm.loading = true;
                vrHelper.jqAjax(urls.qrinfo_list, '',
                    function(res) {
                        var data = res.data || [];
                        _.forEach(data, function(item) {
                            item.created = moment(item.created).format('YYYY-MM-DD HH:mm:ss');
                        });
                        qrcodeListVm.page.vm.list = data;
                        qrcodeListVm.loading = false;
                        $scope.$apply();
                    },
                    function() {
                        qrcodeListVm.loading = false;
                        $scope.$apply();
                    }, 'POST', true, 'QrcodeListControllerLoad');
            }
        };
        opt.init();

        qrcodeListVm.page = {
            vm: {
                remark: '', //qrcodeListVm.page.vm.remark
                num: 0,
                list: [],
            },
            event: {
                viewSaveModal: opt.viewSaveModal,
                save: opt.save, //qrcodeListVm.page.event.save
            }
        };

    }
})();