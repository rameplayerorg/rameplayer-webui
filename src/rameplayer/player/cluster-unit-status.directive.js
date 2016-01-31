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


        vm.editMode = false;
        vm.editUnit = {
            ip: {
                value: vm.unit.address,
                valid: true,
            },
            port: vm.unit.port,
            delay: vm.unit.delay
        };
        vm.colors = clusterService.getColors();
        vm.colorSelected = vm.unit.color;
        vm.openEdit = openEdit;
        vm.cancelEdit = cancelEdit;
        vm.save = save;
        vm.remove = remove;

        function openEdit() {
            vm.editMode = true;
        }

        function cancelEdit() {
            vm.editMode = false;
        }

        function save() {
            if (vm.editUnit.ip.valid) {
                vm.unit.address = vm.editUnit.ip.value;
                vm.unit.port = vm.editUnit.port;
                vm.unit.delay = vm.editUnit.delay;
                vm.editMode = false;
                toastr.success('Unit settings updated.', 'Cluster');
            }
            else {
                toastr.error('IP address is invalid.', 'Cluster Unit Settings');
            }
        }

        function remove() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/settings/remove-unit-modal.html',
                controller: 'RemoveUnitModalController',
                controllerAs: 'vm',
                resolve: {
                    // deliver 'unitHostname' as parameter to controller
                    unitHostname: function() {
                        return vm.unit.hostname;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                clusterService.removeUnit(vm.unit.id);
                toastr.success('Unit removed.', 'Cluster');
            });
        }
    }
})();
