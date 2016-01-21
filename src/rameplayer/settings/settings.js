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
        
        vm.settings = dataService.getSettings();
        
        var setts = '';        
        vm.settings.$promise.then(function(response) {        
            setts = response;
            vm.autoplayUsb = setts.autoplayUsb;
            //if(vm.autoplayUsb == undefined){vm.autoplayUsb = true;}
            //vm.slaveDelay = setts.slaveDelay;
            //if(vm.slaveDelay == undefined){vm.slaveDelay = 0;}
            $log.info('Settings fetched', setts);
        }, function(errorResponse) {
            $log.error('Settings fetching failed', errorResponse);
        });
        
        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionSoftware = rameVersioning.backend;
            vm.rameVersionHardware = rameVersioning.hw;
            $log.info('Version fetched', response);
        }, function(errorResponse) {
            $log.error('Version fetching failed', errorResponse);
        });

        vm.savingStatus = 'loaded';
        vm.saveSettings = saveSettings;
        vm.saveLanguageSettings = saveLanguageSettings;
        vm.uiVersion = uiVersion;
        //$log.info('test:' + uiVersion);

        function autoplayUsb() {
            if (vm.autoplayUsb !== undefined) { 
                return vm.autoplayUsb;
            }
            return true;
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

        function saveSettings() {
            
            vm.settings.autoplayUsb = autoplayUsb();
            //vm.settings.slaveDelay = slaveDelay();
            
            vm.settings.$save(function() {
                vm.savingStatus = 'saved';
                toastr.success('Settings saved.');
            });
        }
    }

})();
