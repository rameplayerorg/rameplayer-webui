(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
            '$log', '$http', 'dataService', 'settings', 'settingsUrl'
    ];
//            '$log', '$http', '$resource', 'dataService', 'settings'

    //function SettingsController($log, $http, $resource, dataService, settings) {

    function SettingsController($log, $http, dataService, settings, settingsUrl) {
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
            vm.savingStatus = "saved";

            //settings.$save();   // might have worked this way if it would be a $resource ...?
            
            var data = angular.toJson(settings);
            //$log.info("Saving with post to " + settingsUrl + " : " + data);

            $http.post(settingsUrl, data, { headers: { 'Content-Type': 'application/json'}})
                .then(function(response) {
                    $log.info('Saved settings', response);
                },
                function(errorResponse) {
                    $log.error('Error when saving settings', errorResponse);
                });

        }
    }

})();
