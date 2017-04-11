/**
 * 描述:js模板
 */
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
        agentListVm.page = {
            vm: {

            },
            event: {

            }
        };

        var opt = {
            init: function() {

            }
        };
        opt.init();
    }
})();