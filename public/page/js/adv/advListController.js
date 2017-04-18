/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('AdvListController', AdvListController);

    AdvListController.$inject = ['$scope'];

    function AdvListController($scope) {
        var advListVm = this,
            urls = {
                adv_list: '/adv/list',
                adv_save: '/adv/save',
                common_img_upload: '/common/img/upload',
            };

        advListVm.loading = false;

        var opt = {
            viewAdvSaveModal: function() {
                _.forEach(advListVm.page.vm.save, function(value, key) {
                    advListVm.page.vm.save[key] = (key == 'scope') ? '全国' : '';
                });
                $("#vrAdvSaveViewModal").modal('show');
            },
            save: function() {
                var imgCode = advListVm.page.vm.save.imgCode;
                if (imgCode == '') {
                    message.error('图片不可为空.');
                    return false;
                }
                var scope = advListVm.page.vm.save.scope;
                var remark = _.trim(advListVm.page.vm.save.remark);

                var data = {
                    imgCode: imgCode,
                    scope: scope,
                };
                if (remark) {
                    data.remark = remark;
                }
                advListVm.loading = true;
                vrHelper.jqAjax(urls.adv_save, data, function(res) {
                    message.success('操作成功.');
                    opt.list();
                    advListVm.loading = false;
                    $scope.$apply();
                }, function(err) {
                    advListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'agentSaveLoadId')

            },
            list: function() {
                vrHelper.jqAjax(urls.adv_list, '', function(res) {
                    var data = res.data;
                    advListVm.page.vm.list = data || [];
                    $scope.$apply();
                }, function(err) {}, 'POST', false, 'agentSaveLoadId');
            },
            comUploadFileChange: function() {
                var formdata = new FormData();
                formdata.append("file", $("#uploadFormFile")[0].files[0]);

                $.ajax({
                    type: 'POST',
                    url: urls.common_img_upload,
                    data: formdata,
                    cache: false,
                    processData: false, //  不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                    contentType: false, //  不设置Content-type请求头
                    success: function(res) {
                        message.success('上传成功.');
                        var imgCode = res.data.imgCode || '';
                        advListVm.page.vm.save.imgCode = imgCode;
                        advListVm.loading = false;
                        $scope.$apply();
                    },
                    error: function() {
                        advListVm.loading = false;
                        $scope.$apply();
                    }
                })

                // vrHelper.jqAjax(urls.common_img_upload, formdata, function(res) {
                //     message.success('上传成功.');
                //     var imgCode = res.data.imgCode || '';
                //     advListVm.page.vm.save.imgCode = imgCode;
                //     advListVm.loading = false;
                //     $scope.$apply();
                // }, function(err) {
                //     advListVm.loading = false;
                //     $scope.$apply();
                // }, 'POST', false, 'agentSaveLoadId');

            },
            init: function() {
                opt.list();
            }
        };

        advListVm.page = {
            vm: {
                list: [],
                save: {
                    imgCode: '',
                    scope: '全国',
                    remark: ''
                }
            },
            event: {
                viewAdvSaveModal: opt.viewAdvSaveModal, //advListVm.page.event.viewAdvSaveModal
                comUploadFileChange: opt.comUploadFileChange,
                save: opt.save, //advListVm.page.event.save
            }
        };
        opt.init();
    }
})();