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
            urls = {};

        baseVm.loading = false;

        var opt = {
            update: function() {

            },
            proChange: function(pid) {
                var tempCityArr = [];
                tempCityArr.push({ text: '市', id: '' });
                angular.forEach(city_u, function(item) {
                    if (item.pid == pid) {
                        tempCityArr.push({ text: item.text, id: item.id });
                    }
                });
                baseVm.page.vm.city = tempCityArr;
                baseVm.page.vm.curCity = '';
            },
            detail: function() {
                baseVm.loading = true;
                vrHelper.jqAjax('/common/base/info', '', function(res) {
                    var data = res.data;
                    baseVm.page.vm.detail = data;
                    baseVm.loading = false;
                    $scope.$apply();
                }, function() {
                    baseVm.loading = false;
                    $scope.$apply();
                }, 'POST');
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
                pro: [],
                curPor: '', //baseVm.page.vm.curPor
                city: [],
                curCity: ''
            },
            event: {
                update: opt.update,
                proChange: opt.proChange, //baseVm.page.event.proChange
            }
        };


        opt.init();
    }
})();