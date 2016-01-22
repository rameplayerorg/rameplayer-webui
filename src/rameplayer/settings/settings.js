(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', '$translate', 'uiVersion', 'toastr', '$scope', '$localStorage', '$window'
    ];

    function SettingsController($log, $http, dataService, $translate,
                                uiVersion, toastr, $scope, $localStorage, $window) {

        var $injector = angular.injector();

        var vm = this;
        
        $scope.storage = $localStorage;
        
        vm.languageId = initLanguage();
        vm.saveLanguageSettings = saveLanguageSettings;
        
        vm.autoplayUsb = initAutoplayUsb();
        vm.saveUsbSetting = saveUsbSetting;
        
        vm.uiVersion = uiVersion;
        //$log.info('test:' + uiVersion);
        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionSoftware = rameVersioning.backend;
            vm.rameVersionHardware = rameVersioning.hw;
            $log.info('Version fetched', response);
        }, function(errorResponse) {
            $log.error('Version fetching failed', errorResponse);
        });
        
        vm.ipAddress = initIpAddressInfo();
        vm.hostname = initHostnameInfo();        
        
        function initIpAddressInfo() {
            var adr = dataService.getSystemSettings().ipAddress;
            if (adr) { 
                return adr;
            }
            return 'IP address not available';
        }

        function initHostnameInfo() {
            var hn = dataService.getSystemSettings().hostname;
            if (hn) { 
                return hn;
            }
            return 'Hostname not set';
        }

        function initLanguage() {
            var langId;
            if ($scope.storage.language) {
                langId = $scope.storage.language;
                $log.debug('Using language from localstorage:', langId);
            }
            else if ($window.navigator.language) {
                langId = $window.navigator.language;
                $log.debug('Detected browser language', langId);
            }
            else if ($window.navigator.browserLanguage) {
                // IE
                langId = $window.navigator.browserLanguage;
                $log.debug('Detected browser language (browserLanguage)', langId);
            }
            else {
                langId = 'en-US';
                $log.debug('Using default language', langId);
            }
            $translate.use(langId);
            return langId;
            
        }
        
        function saveLanguageSettings() {
            $scope.storage.language = vm.languageId;
            $translate.use(vm.languageId);
            
            toastr.success('Language saved.');
        }
        
        function initAutoplayUsb() {
            var autoplay; 
            if ($scope.storage.autoplayUsb !== undefined) {
                autoplay = $scope.storage.autoplayUsb;
            }
            else {
                autoplay = true;
            }
            //$log.info('autoplay:' + autoplay);
            return autoplay;
        }
        
        function validateAutoplayUsb() {
            if (vm.autoplayUsb !== undefined) {
                return vm.autoplayUsb;
            }
            return true;
        }
        
        function saveUsbSetting() {
            $scope.storage.autoplayUsb = validateAutoplayUsb();
            //$log.info('storageusb:' + vm.autoplayUsb);
            toastr.success('Option saved: Autoplay USB');
        }

    }
})();
