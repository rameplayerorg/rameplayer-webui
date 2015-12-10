(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', 'settings', '$translate', 'toastr', 'uiVersion'
    ];

    function SettingsController($log, $http, dataService, settings, $translate, uiVersion) {

        var $injector = angular.injector();

        var vm = this;

        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionSoftware = rameVersioning.software;
            vm.rameVersionHardware = rameVersioning.hardware;
            $log.info('Version fetched', response);
        }, function(errorResponse) {
            $log.error('Version fetching failed', errorResponse);
        });

        vm.resetHdmiInterface = resetHdmiInterface;
        vm.slaveDelay = 0;
        vm.languageId = settings.language; // TODO: fetch from saved settings, now from coremodule-settingsjson-indexhtmlurl
        vm.savingStatus = "loaded";
        vm.saveSettings = saveSettings;

        //vm.hdmishaked = "-";
	vm.uiVersion = uiVersion;
        //$log.info('test:' + settingsUrl);

        function resetHdmiInterface() {
            // TODO: send reset request to backend
            toastr.warning('Resetting HDMI', '(TEST notification)');
            //vm.hdmishaked = "shaked";
        }

        function slaveDelay() {
        }

        function saveSettings(){
            settings.language = vm.languageId;
            $translate.use(settings.language);
            settings.$save(function() {
                vm.savingStatus = "saved";
            });
        }
    }

})();
