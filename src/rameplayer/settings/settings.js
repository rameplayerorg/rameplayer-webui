/* jshint maxparams:11 */
(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', 'clusterService', '$translate', 'uiVersion',
        'toastr', '$scope', '$localStorage', '$window', '$document'
    ];

    function SettingsController($log, $http, dataService, clusterService, $translate,
                                uiVersion, toastr, $scope, $localStorage, $window, $document) {

        var $injector = angular.injector();

        var vm = this;
        
        $scope.storage = $localStorage;        
        vm.languageId = initLanguage();
        vm.saveLanguageSettings = saveLanguageSettings;

        vm.userSettings = dataService.getSettings();
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
        
        vm.windowTitleInfo = 'RamePlayer';
        var systemSettings = dataService.getSystemSettings();
        systemSettings.$promise.then(function() {
            vm.ipAddress = initIpAddressInfo(systemSettings);
            vm.hostname = initHostnameInfo(systemSettings);
        });

        vm.newUnit = {
            ip: {
                value: '',
                valid: true
            },
            port: 8000,
            delay: 0
        };
        vm.addClusterUnit = addClusterUnit;
        vm.clusterService = clusterService;

        function initIpAddressInfo(systemSettings) {
            var adr = systemSettings.ipAddress;
            vm.windowTitleInfo = ' - ' + vm.windowTitleInfo;
            //$log.debug(' wintit:' + vm.windowTitleInfo);
            if (adr) {
                vm.windowTitleInfo = adr + vm.windowTitleInfo; 
            }
            else {
                adr = 'IP address not available';
                vm.windowTitleInfo = 'No IP' + vm.windowTitleInfo;
            }
            $document[0].title = vm.windowTitleInfo;
            return adr;
        }

        function initHostnameInfo(systemSettings) {
            var hn = systemSettings.hostname;
            vm.windowTitleInfo = ' - ' + vm.windowTitleInfo;
            if (hn) {
                vm.windowTitleInfo = hn + vm.windowTitleInfo;
            }
            else {
                hn = 'Hostname not set';
                vm.windowTitleInfo = 'No name' + vm.windowTitleInfo;
            }
            $document[0].title = vm.windowTitleInfo;
            return hn;
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

        function saveUsbSetting() {
            vm.userSettings.$save(function() {
                toastr.clear();
                //toastr.success('Option saved: Autoplay USB');
                toastr.error('Option saving to backend: Autoplay USB', 'TODO');
            });
            //$log.info('storageusb: ' + vm.autoplayUsb + ", " + userSettings.autoplayUsb);            
        }

        function addClusterUnit() {
            $log.debug('Add Cluster Unit');
            if (vm.newUnitIp.valid) {
                clusterService.addUnit(vm.newUnit.ip.value,
                                       vm.newUnit.port,
                                       vm.newUnit.delay);
                toastr.success('New unit added.', 'Cluster');
            }
            else {
                // Sticky toast
                toastr.error('IP address of new unit', 'Invalid settings', {
                    timeOut: 0,
                    closeButton: true
                });
            }
        }
    }
})();
