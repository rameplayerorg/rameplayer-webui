(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', 'settings'
    ];

    function SettingsController($log, $http, dataService, settings) {
        //var core = angular.module('rameplayer.core');
        var $injector = angular.injector();

        var vm = this;
        vm.resetHdmiInterface = resetHdmiInterface;
        vm.slaveDelay = 0;
        vm.languageId = settings.language; // TODO: fetch from saved settings, now from coremodule-settingsjson-indexhtmlurl
        vm.savingStatus = "loaded";
        vm.saveSettings = saveSettings;
        
        vm.hdmishaked = "shaky";
        //$log.info('test');
        
//        var settingsResource = $resource(vm.settingsUrl);
//        settingsResource.stripTrailingSlashes = false;

        //$log.info('test:' + settingsUrl);
        
        function resetHdmiInterface() {
            vm.hdmishaked = "painettu";
            vm.hdmishaked = settings;
        }
        
        function slaveDelay() {
            
        }
        
        function saveSettings(){
            settings.language = vm.languageId;
            settings.$save(function() {
                vm.savingStatus = "saved";
            });
        }
    }

})();
