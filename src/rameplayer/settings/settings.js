(function() {

    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$log', '$http', 'dataService', '$translate', 'uiVersion', 'toastr', '$scope', '$localStorage'
    ];

    function SettingsController($log, $http, dataService, $translate, uiVersion, toastr, $scope, $localStorage) {

        var $injector = angular.injector();

        var vm = this;
        
        $scope.storage = $localStorage;
        
        vm.languageId = initLanguage();
        vm.saveLanguageSettings = saveLanguageSettings;
        
        vm.autoplayUsb = initAutoplayUsb();
        vm.saveUsbSetting = saveUsbSetting;
        
        /*vm.settings = dataService.getSettings();
        var setts = '';        
        vm.settings.$promise.then(function(response) {        
            setts = response;
            //vm.autoplayUsb = setts.autoplayUsb;
            //if(vm.autoplayUsb == undefined){vm.autoplayUsb = true;}
            //vm.slaveDelay = setts.slaveDelay;
            //if(vm.slaveDelay == undefined){vm.slaveDelay = 0;}
            $log.info('Settings fetched', setts);
        }, function(errorResponse) {
            $log.error('Settings fetching failed', errorResponse);
        });*/
        
        var rameVersioning = '';
        dataService.getRameVersioning().then(function(response) {
            rameVersioning = response.data;
            vm.rameVersionSoftware = rameVersioning.backend;
            vm.rameVersionHardware = rameVersioning.hw;
            $log.info('Version fetched', response);
        }, function(errorResponse) {
            $log.error('Version fetching failed', errorResponse);
        });
        
        vm.uiVersion = uiVersion;
        
        
        /*vm.savingStatus = "loaded";
        vm.saveSettings = saveSettings;*/
        
        
        
        //$log.info('test:' + uiVersion);

//        function slaveDelay() {
//            if(vm.slaveDelay != undefined){
//                return vm.slaveDelay.toFixed();
//            }
//            return 0;
//        }
        
        /*function autoplayUsb(){
            if(vm.autoplayUsb != undefined){ 
                return vm.autoplayUsb;
            }
            return true;
        }*/
        
        function initLanguage() {
            var langId;
            if($scope.storage.language){
                langId = $scope.storage.language;
                //$log.info('storagelang:' + langId);
            } else 
            if(window.navigator.language){
                langId = window.navigator.language;
            } else {
                langId = "en";
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
            if($scope.storage.autoplayUsb != undefined){
                autoplay = $scope.storage.autoplayUsb;
            }else{
                autoplay = true;
            }
            //$log.info('autoplay:' + autoplay);
            return autoplay;
        }
        
        function validateAutoplayUsb(){
            if(vm.autoplayUsb != undefined){ 
                return vm.autoplayUsb;
            }
            return true;
        }
        
        function saveUsbSetting() {
            $scope.storage.autoplayUsb = validateAutoplayUsb();
            //$log.info('storageusb:' + vm.autoplayUsb);
            toastr.success('Option saved: Autoplay USB');
        }

        /*function saveSettings(){
            
            //vm.settings.autoplayUsb = autoplayUsb();
            //vm.settings.slaveDelay = slaveDelay();
            
            vm.settings.$save(function() {
                vm.savingStatus = "saved";
                toastr.success('Settings saved.');
            });
        }*/
    }

})();
