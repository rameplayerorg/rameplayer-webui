(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .directive('rameClusterUnitStatus', rameClusterUnitStatus);

    rameClusterUnitStatus.$inject = ['$log', 'clusterService'];

    function rameClusterUnitStatus($log, clusterService) {
        var directive = {
            restrict: 'E', // only element
            scope: {
                unit: '='
            },
            templateUrl: 'rameplayer/player/cluster-unit-status.html',
            controller: ClusterUnitStatusController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    ClusterUnitStatusController.$inject = ['$log', '$uibModal', 'clusterService', 'toastr'];

    function ClusterUnitStatusController($log, $uibModal, clusterService, toastr) {
        var vm = this;
        vm.statuses = clusterService.statuses;
    }
})();
