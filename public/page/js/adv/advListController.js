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
            viewLargeImgModal: function(imgCode) {
                advListVm.page.vm.largeImgUrl = imgCode;
                $("#viewLargeImgModal").modal('show');
            },
            viewAdvSaveModal: function() {
                if (advListVm.page.vm.list.length == 5) {
                    message.error('最多添加5条广告信息.');
                    return false;
                }


                setTimeout(function() {
                    advListVm.page.vm.save.scope = '全国';
                    advListVm.page.vm.save.remark = '';
                    advListVm.page.vm.save.imgCode = '';
                    $scope.$apply();
                }, 0);

                $("#uploadFormFile").val(null);
                document.getElementById("uploadForm").reset();
                $('#uploadImg').attr("src", '');

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
                    img: imgCode,
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
                    $("#vrAdvSaveViewModal").modal('hide');
                    $scope.$apply();
                }, function(err) {
                    advListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'agentSaveLoadId')

            },
            list: function() {
                vrHelper.jqAjax(urls.adv_list, '', function(res) {
                    var data = res.data;
                    _.forEach(data, function(item) {
                        item.created = moment(item.created).format('YYYY-MM-DD HH:mm');
                    });
                    advListVm.page.vm.list = data || [];
                    $scope.$apply();
                }, function(err) {}, 'POST', false, 'agentSaveLoadId');
            },
            comUploadFileChange: function(event) {
                if (event) {
                    var filePath = '';
                    var size = 0;
                    if (event && event.target && event.target.files) {
                        var file = event.target.files[0];
                        size = file.size || 0;
                        filePath = file.name;
                    } else {
                        filePath = $(event.target).val();
                    }

                    var index = filePath.lastIndexOf('.');
                    var suffix = filePath.substring(index, filePath.length);

                    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
                        message.error('图片类型必须是.gif,jpeg,jpg,png中的一种');
                        return false;
                    }

                    var imgSize = size / 1024 / 1024;
                    if (imgSize > 2) {
                        message.error('图片大小超过2M,请上传小于2M的图片.');
                        return false;
                    }
                }
                vrHelper.block.blockUI('#advUploadImgLoadId');
                advListVm.loading = true;
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

                        $("#uploadFormFile").val(null);
                        if ($("#uploadFormFile").val()) {
                            document.getElementById("uploadForm").reset();
                        }

                        advListVm.loading = false;
                        vrHelper.block.unblockUI('#advUploadImgLoadId');
                        $scope.$apply();
                    },
                    error: function() {
                        advListVm.loading = false;
                        vrHelper.block.unblockUI('#advUploadImgLoadId');
                        $scope.$apply();
                    }
                })
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
                },
                largeImgUrl: '',
            },
            event: {
                viewAdvSaveModal: opt.viewAdvSaveModal,
                comUploadFileChange: opt.comUploadFileChange,
                save: opt.save,
                viewLargeImgModal: opt.viewLargeImgModal,
            }
        };
        opt.init();
    }
})();