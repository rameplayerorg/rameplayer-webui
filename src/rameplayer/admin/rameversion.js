/*jshint maxcomplexity:22 */
/*jshint maxstatements:54 */
(function() {

    'use strict';

    angular.module('rameplayer.admin')
            .controller('RameVersionController', RameVersionController);

    RameVersionController.$inject = [
    'logger', 'dataService', 'toastr', '$rootScope', 'uiVersion'
    ];

    function RameVersionController(logger, dataService, toastr, $rootScope, uiVersion) {
        var vm = this;
        
        vm.isCollapsed = true;
        
        vm.rameVersionWebUI = uiVersion;
        
        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionBackend = rameVersioning.backend;
            vm.rameVersionHardware = rameVersioning.hw;
            vm.rameVersionHardwareAddon = rameVersioning.hwAddon;
            vm.rameVersionHardwareCfg = rameVersioning.hwCfg;
            vm.rameVersionFirmware = rameVersioning.firmware;
            logger.debug('Software version fetched', response);
        }, function(errorResponse) {
            logger.error('Software version fetching failed', errorResponse);
        });        
    }
})();
