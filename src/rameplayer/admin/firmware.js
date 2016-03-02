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
        
        vm.factoryReset = factoryReset;

        /**
         * @name init
         * @description Initializes variables. Called after system settings are
         *              fetched from server.
         */
        function init() {
            //logger.warn(vm.upgradesAvailable.firmwares);
            var lnth = vm.upgradesAvailable.firmwares.length;
            for (var i = 0; i < lnth; i++) {
                if (!vm.upgradesAvailable.firmwares[i].recommend) {} // jshint ignore:line
                else {
                    vm.upgradeRecommendation = vm.upgradesAvailable.firmwares[i];
                    vm.upgradeSelection = vm.upgradesAvailable.firmwares[i];
                    //logger.warn(vm.upgradesAvailable.firmwares[i].recommend);
                }
                if ((i === lnth - 1) && !vm.upgradeRecommendation) {
                    vm.upgradeSelection = vm.upgradesAvailable.firmwares[i];
                }
            }
        }

        function upgradeSoftware() {
            // TODO:
            logger.warn(vm.upgradeRecommendation);
            logger.info(vm.upgradesAvailable);
            toastr.warning('TODO');
        }
        
        function factoryReset(){
            toastr.warning('TODO');
        }
    }
})();
