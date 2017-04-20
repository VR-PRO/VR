/**
 * 描述:js模板
 */
(function() {
    angular
        .module("vrApp")
        .controller('BaseInfoController', BaseInfoController);

    BaseInfoController.$inject = ['$scope'];

    function BaseInfoController($scope) {
        var baseVm = this,
            urls = {
                update: '/common/base/update',
                detail: '/common/base/info'
            };

        baseVm.loading = false;

        var opt = {
            update: function() {
                var name = _.trim(baseVm.page.vm.name);
                var addr = _.trim(baseVm.page.vm.addr);
                var pid = baseVm.page.vm.curPor;
                var cid = baseVm.page.vm.curCity;
                var mobile = _.trim(baseVm.page.vm.mobile);

                if (name == '') { message.error('名称不可为空.'); return false; }
                if (pid == '') { message.error('请选择省信息.'); return false; }
                if (cid == '') { message.error('请选择市信息.'); return false; }
                if (!vrHelper.validate.mobile(mobile)) { message.error('手机号格式不正确.'); return false; }

                var data = {
                    name: name,
                    addr: addr,
                    pid: pid,
                    cid: cid,
                    mobile: mobile,
                };

                baseVm.loading = true;
                vrHelper.jqAjax(urls.update, data, function(res) {
                    message.success('操作成功');
                    baseVm.loading = false;
                    $scope.$apply();
                    opt.detail();
                }, function() {
                    baseVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'baseInfoLoad');

            },
            proChange: function(pid) {
                opt.proChangeOpt(pid, true);
            },
            proChangeOpt: function(pid, isClear) {
                var tempCityArr = [];
                tempCityArr.push({ text: '市', id: '' });
                angular.forEach(city_u, function(item) {
                    if (item.pid == pid) {
                        tempCityArr.push({ text: item.text, id: item.id });
                    }
                });
                baseVm.page.vm.city = tempCityArr;
                isClear && (baseVm.page.vm.curCity = '');
            },
            formatData: function(data) {
                baseVm.page.vm.name = data.name || '';
                baseVm.page.vm.addr = data.addr || '';
                baseVm.page.vm.curPor = data.pid || '';
                baseVm.page.vm.curCity = data.cid || '';
                baseVm.page.vm.mobile = data.mobile || '';
                baseVm.page.vm.curPor && opt.proChangeOpt(baseVm.page.vm.curPor, false);
            },
            detail: function() {
                baseVm.loading = true;
                vrHelper.jqAjax(urls.detail, '', function(res) {
                    var data = res.data;
                    opt.formatData(data);
                    baseVm.loading = false;
                    $scope.$apply();
                }, function() {
                    baseVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'baseInfoLoad');
            },
            init: function() {
                var proTempArr = [];
                proTempArr.push({ text: '省', id: '' });
                proTempArr = proTempArr.concat(provinces_u);
                baseVm.page.vm.pro = proTempArr;
                baseVm.page.vm.curPor = '';

                var tempCityArr = [];
                tempCityArr.push({ text: '市', id: '' });
                baseVm.page.vm.city = tempCityArr;
                baseVm.page.vm.curCity = '';

                opt.detail();
            }
        };

        baseVm.page = {
            vm: {
                name: '',
                addr: '',
                mobile: '',
                pro: [],
                curPor: '', //baseVm.page.vm.curPor
                city: [],
                curCity: ''
            },
            event: {
                update: opt.update,
                proChange: opt.proChange,
            }
        };


        opt.init();
    }
})();