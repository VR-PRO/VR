(function() {
    angular
        .module("vrApp")
        .controller('AgentListController', AgentListController);

    AgentListController.$inject = ['$scope'];

    function AgentListController($scope) {
        var agentListVm = this,
            pageLoadId = 'agentPageLoadId',
            urls = {
                agent_save: '/agent/save',
                agent_list: '/agent/list',
                user_check: '/user/check'
            };
        agentListVm.loading = false;


        var opt = {
            agentSaveModalView: function() {
                _.forEach(agentListVm.page.vm.save, function(value, key) {
                    agentListVm.page.vm.save[key] = '';
                });

                $('#agentSaveModal').modal('show');
            },
            validate: function(data) {
                if (data.name == '') { message.error('名称不可为空.'); return false; }
                if (!vrHelper.validate.mobile(data.mobile)) { message.error('手机号格式不正确.'); return false; }
                if (!vrHelper.validate.number(data.rate)) { message.error('分成比例格式不正确.'); return false; }
                if (!vrHelper.validate.pwd(data.pwd)) { message.error('初始密码格式不正确.'); return false; }
                return true;
            },
            save: function() {
                var name = _.trim(agentListVm.page.vm.save.name);
                var mobile = _.trim(agentListVm.page.vm.save.mobile);
                var rate = _.trim(agentListVm.page.vm.save.rate);
                var pwd = _.trim(agentListVm.page.vm.save.pwd);
                var remark = _.trim(agentListVm.page.vm.save.remark);

                var data = {
                    name: name,
                    mobile: mobile,
                    rate: rate,
                    pwd: pwd,
                    remark: remark
                };
                if (opt.validate(data)) {
                    opt.check(function() {
                        agentListVm.loading = true;
                        vrHelper.jqAjax(urls.agent_save, data, function(res) {
                            message.success('操作成功.');
                            $('#agentSaveModal').modal('hide');

                            agentListVm.pageCfg.currentPage = 1;
                            opt.list();

                            agentListVm.loading = false;
                            $scope.$apply();
                        }, function(err) {
                            agentListVm.loading = false;
                            $scope.$apply();
                        }, 'POST', false, 'agentPageLoadId');

                    });
                }
            },
            list: function() {
                var name = _.trim(agentListVm.page.vm.top.name);
                var data = {
                    pageNo: agentListVm.pageCfg.currentPage,
                    pageSize: agentListVm.pageCfg.itemsPerPage
                };
                if (name) {
                    data.name = name;
                }

                vrHelper.jqAjax(urls.agent_list, data, function(res) {
                    var data = res.data;
                    var list = data.list;

                    agentListVm.page.vm.list = list || [];
                    agentListVm.pageCfg.totalItems = data.totalItems || 0;

                    agentListVm.loading = false;
                    $scope.$apply();
                }, function(err) {
                    agentListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'agentSaveLoadId');
            },
            check: function(callback) {
                agentListVm.loading = true;
                var mobile = _.trim(agentListVm.page.vm.save.mobile);
                vrHelper.jqAjax(urls.user_check, { mobile: mobile }, function(res) {
                    agentListVm.loading = false;
                    $scope.$apply();
                    callback && callback();
                }, function(err) {
                    agentListVm.loading = false;
                    $scope.$apply();
                }, 'POST', false, 'agentSaveLoadId');
            },
            rearch: function() {
                agentListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };

        agentListVm.page = {
            vm: {
                save: {
                    name: '', //agentListVm.page.vm.save.name
                    mobile: '',
                    rate: '',
                    remark: '',
                    pwd: ''
                },
                list: [], //agentListVm.page.vm.list
                top: {
                    name: '' //agentListVm.page.vm.top.name
                }
            },
            event: {
                agentSaveModalView: opt.agentSaveModalView,
                save: opt.save, //agentListVm.page.event.save
                rearch: opt.rearch, //agentListVm.page.event.rearch
            }
        };

        agentListVm.pageCfg = {
            isInit: false,
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [15, 20, 30],
            rememberPerPage: 'agentListVm.pageCfg.cookie.key',
            onChange: function() {
                if (agentListVm.pageCfg.totalItems === 0) { return false; }
                opt.list();
            },
            onInit: function() {
                agentListVm.pageCfg.currentPage = 1;
                opt.list();
            }
        };

    }
})();