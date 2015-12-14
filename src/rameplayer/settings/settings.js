(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', '$translate', 'uiVersion'
        //'$log', '$http', 'dataService', 'settings', '$translate', 'toastr', 'uiVersion'
    ];

    function SettingsController($log, $http, dataService, $translate, uiVersion) {
        
    //function SettingsController($log, $http, dataService, settings, $translate, toastr, uiVersion) {

        var $injector = angular.injector();

        var vm = this;

        vm.settings = dataService.getSettings();
		var rameVersioning = '';
		dataService.getRameVersioning().then(function(response) {
			rameVersioning = response.data;
			vm.rameVersionSoftware = rameVersioning.backend;
			vm.rameVersionHardware = rameVersioning.hw;
			$log.info('Version fetched', response);
		}, function(errorResponse) {
			$log.error('Version fetching failed', errorResponse);
		});

		vm.resetHdmiInterface = resetHdmiInterface;
		vm.slaveDelay = 0;
		vm.languageId = 'en'; // TODO: fetch from saved settings, now from coremodule-settingsjson-indexhtmlurl
		vm.savingStatus = "loaded";
		vm.saveSettings = saveSettings;

		vm.hdmishaked = "shaky";
                vm.uiVersion = uiVersion;
		//$log.info('test');
        
        vm.autoplayUsb = true;

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
            language = vm.languageId;
            $translate.use(language);
            vm.settings.$save(function() {
                vm.savingStatus = "saved";
                toastr.success('Settings saved.');
            });
        }
    }

})();
