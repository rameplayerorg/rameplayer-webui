(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .directive('rameClusterUnit', rameClusterUnit);

    rameClusterUnit.$inject = ['$log', 'clusterService'];

    function rameClusterUnit($log, clusterService) {
        var directive = {
            restrict: 'E', // only element
            scope: {
                unit: '='
            },
            templateUrl: 'rameplayer/settings/cluster-unit.html',
            controller: ClusterUnitController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    ClusterUnitController.$inject = ['$log', '$uibModal', 'clusterService', 'toastr', '$translate'];

    function ClusterUnitController($log, $uibModal, clusterService, toastr, $translate) {
        var vm = this;
        vm.editMode = false;
        vm.editUnit = {
            ip: {
                value: vm.unit.host,
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
                vm.unit.host = vm.editUnit.ip.value;
                vm.unit.port = vm.editUnit.port;
                vm.unit.delay = vm.editUnit.delay;
                clusterService.updateUnit(vm.unit);
                vm.editMode = false;
                $translate(['CLUSTER', 'UNIT_SETTINGS_UPDATED_DESC'])
                .then(function(translations) {
                    toastr.success(translations.UNIT_SETTINGS_UPDATED_DESC, translations.CLUSTER);
                });
            }
            else {
                $translate(['CLUSTER_UNIT_SETTINGS', 'IP_ADDRESS_INVALID_DESC'])
                .then(function(translations) {
                    toastr.error(translations.IP_ADDRESS_INVALID_DESC, translations.CLUSTER_UNIT_SETTINGS);
                });
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
                $translate(['CLUSTER', 'UNIT_REMOVED_DESC'])
                .then(function(translations) {
                    toastr.success(translations.UNIT_REMOVED_DESC, translations.CLUSTER);
                });
            });
        }
    }
})();
