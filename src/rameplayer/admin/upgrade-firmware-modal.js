(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('UpgradeFirmwareModalController', UpgradeFirmwareModalController);

    UpgradeFirmwareModalController.$inject = ['logger', '$uibModalInstance', 'dataService', 'upgradeSelection'];

    function UpgradeFirmwareModalController(logger, $uibModalInstance, dataService, upgradeSelection) {
        var vm = this;

        vm.progress = 0;
        vm.status = '';
        vm.upgradeSelection = upgradeSelection;
        vm.start = start;
        vm.cancel = cancel;
        vm.started = false;

        function start() {
            vm.started = true;
            dataService.upgradeFirmware(vm.upgradeSelection.uri)
                .then(function(response) {
                    // upgrade complete
                    vm.progress = 100;
                    vm.status = 'Restarting device...';
                },
                function(errorResponse) {
                    logger.error('Firmware upgrade failed', vm.upgradeSelection, errorResponse);
                });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
