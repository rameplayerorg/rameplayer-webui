(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('UpgradeFirmwareModalController', UpgradeFirmwareModalController);

    UpgradeFirmwareModalController.$inject = ['logger', '$uibModalInstance', 'dataService',
        'upgradeSelection', 'statusService'];

    function UpgradeFirmwareModalController(logger, $uibModalInstance, dataService,
                                            upgradeSelection, statusService) {
        var vm = this;

        vm.progress = 0;
        vm.status = '';
        vm.upgradeSelection = upgradeSelection;
        vm.start = start;
        vm.cancel = cancel;
        vm.started = false;
        vm.restartTimeout = 2 * 60000; // 2 mins

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
