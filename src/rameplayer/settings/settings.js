(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', '$translate', 'uiVersion', 'toastr'
    ];

    function SettingsController($log, $http, dataService, $translate, uiVersion, toastr) {

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
		
		vm.autoplayUsb = true;
		vm.slaveDelay = 0;
		vm.languageId = 'en'; // TODO: fetch from saved settings
		vm.savingStatus = "loaded";
		vm.saveSettings = saveSettings;
		vm.uiVersion = uiVersion;
        //$log.info('test:' + settingsUrl);

        function slaveDelay() {
        }

        function saveSettings(){
            var language = vm.languageId;
            $translate.use(language);
            vm.settings.$save(function() {
                vm.savingStatus = "saved";
                toastr.success('Settings saved.');
            });
        }
    }

})();
