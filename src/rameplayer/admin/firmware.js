/*jshint maxcomplexity:22 */
/*jshint maxstatements:54 */
(function() {

    'use strict';

    angular.module('rameplayer.admin')
            .controller('FirmwareController', FirmwareController);

    FirmwareController.$inject = [
    'logger', 'dataService', 'toastr', '$rootScope'
    ];

    function FirmwareController(logger, dataService, toastr, $rootScope) {
        var vm = this;

        vm.upgradesAvailable = dataService.getUpgradesAvailable();
        vm.upgradesAvailable.$promise.then(function() {
            init();
        });

        vm.upgradeRecommendation = null;
        vm.upgradeSoftware = upgradeSoftware;
        vm.upgradeSelection = null;

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
            logger.warn(vm.upgradesAvailable.firmwareVersions);
            var lnth = vm.upgradesAvailable.firmwareVersions.length;
            for (var i = 0; i < lnth; i++) {
                if (!vm.upgradesAvailable.firmwareVersions[i].recommend) {} // jshint ignore:line
                else {
                    vm.upgradeRecommendation = vm.upgradesAvailable.firmwareVersions[i];
                    vm.upgradeSelection = vm.upgradesAvailable.firmwareVersions[i];
                    logger
                            .warn(vm.upgradesAvailable.firmwareVersions[i].recommend);
                }
                if ((i === lnth - 1) && !vm.upgradeRecommendation) {
                    vm.upgradeSelection = vm.upgradesAvailable.firmwareVersions[i];
                }
            }
        }

        function upgradeSoftware() {
            // TODO:
            logger.warn(vm.upgradeRecommendation);
            logger.info(vm.upgradesAvailable);
            toastr.error('TODO');
        }
    }
})();
