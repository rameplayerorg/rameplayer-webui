/*jshint maxcomplexity:22 */
/*jshint maxstatements:54 */
(function() {

    'use strict';

    angular.module('rameplayer.admin')
            .controller('FirmwareController', FirmwareController);

    FirmwareController.$inject = [
    'logger', 'dataService', 'toastr', '$uibModal'
    ];

    function FirmwareController(logger, dataService, toastr, $uibModal) {
        var vm = this;

        vm.upgradesAvailable = dataService.getFirmwareUpgradesAvailable();
        vm.upgradesAvailable.$promise.then(function() {
            init();
        });

        vm.upgradeLatestStable = null;
        vm.upgradeSelection = null;
        vm.upgradeFirmware = upgradeFirmware;
        vm.upgradeFirmwareModal = upgradeFirmwareModal;

        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionSoftware = rameVersioning.backend;
            vm.rameVersionHardware = rameVersioning.hw;
            logger.info('Software version fetched', response);
        }, function(errorResponse) {
            logger.error('Software version fetching failed', errorResponse);
        });
        
        /**
         * @name init
         * @description Initializes variables. Called after system settings are
         *              fetched from server.
         */
        function init() {
            //logger.warn(vm.upgradesAvailable.firmwares);  // jshint ignore:line 
            var lnth = vm.upgradesAvailable.firmwares.length;
            for (var i = 0; i < lnth; i++) {
                if (vm.upgradesAvailable.firmwares[i].stable == true // jshint ignore:line
                        && vm.upgradesAvailable.firmwares[i].latest == true) // jshint ignore:line
                { 
                    vm.upgradeLatestStable = vm.upgradesAvailable.firmwares[i];
                    vm.upgradeSelection = vm.upgradesAvailable.firmwares[i];
                }
                
                if ((i === lnth - 1) && !vm.upgradeLatestStable) {
                    vm.upgradeSelection = vm.upgradesAvailable.firmwares[i];
                }
            }
        }

        function upgradeFirmware() {
            // TODO: Upgrade firmware, perhaps use modal (see below)
            logger.debug(vm.upgradeLatestStable);
            logger.debug(vm.upgradesAvailable);
            dataService.startFirmwareUpgrade(vm.upgradeSelection.uri);
            toastr.success('Start upgrading firmware');
            //toastr.warning('TODO Start upgrading firmware');
        }
        
        function upgradeFirmwareModal() {
            logger.debug('upgrade firmware modal');

            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/admin/upgrade-firmware-modal.html',
                controller: 'UpgradeFirmwareModalController',
                controllerAs: 'vm'
            });
        }
    }
})();
