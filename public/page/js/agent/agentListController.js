(function() {
    angular
        .module("vrApp")
        .controller('AgentListController', AgentListController);

    AgentListController.$inject = ['$scope'];

    function AgentListController($scope) {
        var agentListVm = this,
            curIndex = -1,
            urls = {};
        agentListVm.loading = false;



        var opt = {
            agentSaveModalView: function() {
                _.forEach(agentListVm.page.vm.save, function(key) {
                    agentListVm.page.vm.save[key] = '';
                });

                $('#agentSaveModal').modal('show');
            },
            validate: function(data) {
                if (data.name == '') { message.error('名称不可为空.'); return false; }
                if (!vrHelper.validate.mobile(data.mobile)) { message.error('手机号格式不正确.'); return false; }
                if (!vrHelper.validate.mobile(data.mobile)) { message.error('手机号格式不正确.'); return false; }
                return true;
            },
            save: function() {

            },
            init: function() {

            }
        };

        agentListVm.page = {
            vm: {
                save: {
                    name: '',
                    mobile: '',
                    rate: '',
                    remark: '',
                    pwd: ''
                }
            },
            event: {
                agentSaveModalView: opt.agentSaveModalView, //agentListVm.page.event.agentSaveModalView
                save: opt.save,

            }
        };


        opt.init();
    }
})();