(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
            '$log', 'dataService', 'settings'
    ];
        
    function SettingsController($log, dataService, settings) {
        var vm = this;
        vm.resetHdmiInterface = resetHdmiInterface;
        vm.slaveDelay = 0;
        vm.languageId = settings.language; // TODO: fetch from saved settings, now from coremodule-settingsjson-indexhtmlurl
        vm.savingStatus = "loaded";
        vm.saveSettings = saveSettings;
        
        vm.hdmishaked = "shaky";
        
        function resetHdmiInterface() {
            vm.hdmishaked = "painettu";
            vm.hdmishaked = settings;
        }
        
        function slaveDelay() {
            
        }
        
        function saveSettings(){
            settings.language = vm.languageId;
            vm.savingStatus = "saved";
        }
    }

})();
