/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('HotelListController', HotelListController);

    HotelListController.$inject = ['$scope'];

    function HotelListController($scope) {

        var hotelListVm = this,
            pageLoadId = 'hotelPageLoadId',
            urls = {
                hotel_save: '/hotel/save',
                hotel_list: '/hotel/list',
                user_check: '/user/check'
            };
        hotelListVm.loading = false;

        var opt = {
            hotelSaveModalView: function() {
                _.forEach(hotelListVm.page.vm.save, function(value, key) {
                    hotelListVm.page.vm.save[key] = '';
                });

                $('#hotelSaveModal').modal('show');
            },
            validate: function(data) {
                if (data.name == '') { message.error('名称不可为空.'); return false; }
                if (!vrHelper.validate.mobile(data.mobile)) { message.error('手机号格式不正确.'); return false; }
                if (!vrHelper.validate.number(data.rate)) { message.error('分成比例格式不正确.'); return false; }
                if (!vrHelper.validate.pwd(data.pwd)) { message.error('初始密码格式不正确.'); return false; }
                return true;
            },
            save: function() {
                var name = _.trim(hotelListVm.page.vm.save.name);
                var mobile = _.trim(hotelListVm.page.vm.save.mobile);
                var rate = _.trim(hotelListVm.page.vm.save.rate);
                var pwd = _.trim(hotelListVm.page.vm.save.pwd);
                var remark = _.trim(hotelListVm.page.vm.save.remark);

                var data = {
                    name: name,
                    mobile: mobile,
                    rate: rate,
                    pwd: pwd,
                    remark: remark
                };
                if (opt.validate(data)) {
                    opt.check(function() {
                        hotelListVm.loading = true;
                        vrHelper.jqAjax(urls.hotel_save, data, function(res) {
                            message.success('操作成功.');
                            $('#hotelSaveModal').modal('hide');

                            hotelListVm.pageCfg.currentPage = 1;
                            opt.list();

                            hotelListVm.loading = false;
                            $scope.$apply();
                        }, function(err) {
                            hotelListVm.loading = false;
                            $scope.$apply();
                        }, 'POST', false, 'hotelPageLoadId');

                    });
                }
            },
            list: function() {
                var name = _.trim(hotelListVm.page.vm.top.name);
                var data = {
                    pageNo: hotelListVm.pageCfg.currentPage,
                    pageSize: hotelListVm.pageCfg.itemsPerPage
                };
                if (name) {
                    data.name = name;
                }

                vrHelper.jqAjax(urls.hotel_list, data, function(res) {
                    var data = res.data;
                    var list = data.list;

                    var devArr = data.devArr;
                    var agentMap = [];
                    angular.forEach(devArr, function(item) {
                        agentMap[item.hotelId] = item.cnt;
                    });
                    angular.forEach(list, function(item) {
                        var cMap = agentMap[item.id];
                        item.devCnt = cMap ? cMap : 0;
                    });

                    hotelListVm.page.vm.list = list || [];
                    hotelListVm.pageCfg.totalItems = data.totalItems || 0;

                    hotelListVm.loading = false;
                    $scope.$apply();
                }, function(err) {
                    hotelListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'hotelSaveLoadId');
            },
            check: function(callback) {
                hotelListVm.loading = true;
                var mobile = _.trim(hotelListVm.page.vm.save.mobile);
                vrHelper.jqAjax(urls.user_check, { mobile: mobile }, function(res) {
                    hotelListVm.loading = false;
                    $scope.$apply();
                    callback && callback();
                }, function(err) {
                    hotelListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'hotelSaveLoadId');
            },
            rearch: function() {
                hotelListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };

        hotelListVm.page = {
            vm: {
                save: {
                    name: '',
                    mobile: '',
                    rate: '',
                    remark: '',
                    pwd: ''
                },
                list: [],
                top: {
                    name: ''
                }
            },
            event: {
                hotelSaveModalView: opt.hotelSaveModalView,
                save: opt.save,
                rearch: opt.rearch,
            }
        };

        hotelListVm.pageCfg = {
            isInit: false,
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [15, 20, 30],
            rememberPerPage: 'hotelListVm.pageCfg.cookie.key',
            onChange: function() {
                if (hotelListVm.pageCfg.totalItems === 0) { return false; }
                opt.list();
            },
            onInit: function() {
                hotelListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };


    }
})();