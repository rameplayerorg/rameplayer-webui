/* jshint maxparams:14 */
(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        'logger', '$http', 'dataService', 'clusterService', '$translate', 'uiVersion',
        'toastr', '$scope', '$localStorage', '$window', '$document', '$uibModal', 'statusService',
        '$location'
    ];

    function SettingsController(logger, $http, dataService, clusterService, $translate,
                                uiVersion, toastr, $scope, $localStorage, $window, $document,
                                $uibModal, statusService, $location) {

        var $injector = angular.injector();

        var vm = this;
        
        $scope.storage = $localStorage;        
        vm.languageId = initLanguage();
        vm.saveLanguageSettings = saveLanguageSettings;

        vm.userSettings = dataService.getSettings();
        vm.saveUsbSetting = saveUsbSetting;
        
        vm.windowTitleInfo = 'RamePlayer';
        vm.locationIp = $location.host();
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
        vm.openReportModal = openReportModal;
        vm.openClusterImportModal = openClusterImportModal;
        vm.exportClusterConfig = exportClusterConfig;

        function initIpAddressInfo(systemSettings) {
            var adr = systemSettings.ipAddress;
            vm.windowTitleInfo = ' - ' + vm.windowTitleInfo;
            //$log.debug(' wintit:' + vm.windowTitleInfo);
            if (!adr) {
                adr = '0.0.0.0';
            }
            
            if (adr !== vm.locationIp) {
                vm.windowTitleInfo = vm.locationIp + vm.windowTitleInfo;
            } else {
                vm.windowTitleInfo = adr + vm.windowTitleInfo;
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
                hn = '???!?!?!!';
                vm.windowTitleInfo = '?' + vm.windowTitleInfo;
            }
            $document[0].title = vm.windowTitleInfo;
            return hn;
        }

        function initLanguage() {
            var langId;
            if ($scope.storage.language) {
                langId = $scope.storage.language;
                logger.debug('Using language from localstorage:', langId);
            }
            else if ($window.navigator.language) {
                langId = $window.navigator.language.toLowerCase();
                logger.debug('Detected browser language', langId);
            }
            else if ($window.navigator.browserLanguage) {
                // IE
                langId = $window.navigator.browserLanguage.toLowerCase();
                logger.debug('Detected browser language (browserLanguage)', langId);
            }
            else {
                langId = 'en-us';
                logger.debug('Using default language', langId);
            }
            $translate.use(langId);
            return langId;
            
        }
        
        function saveLanguageSettings() {
            $scope.storage.language = vm.languageId;
            $translate.use(vm.languageId);
            
            $translate(['LANGUAGE_SAVED'])
            .then(function(translations) {
                toastr.success(translations.LANGUAGE_SAVED);
            });
            
        }

        function saveUsbSetting() {
            vm.userSettings.$save(function() {
                toastr.clear();
                $translate(['OPTION_SAVED', 'OPTION_AUTOPLAY_USB_DESC', 'OPTION_ENABLED', 'OPTION_DISABLED'])
                    .then(function(translations) {
                        toastr.success(translations.OPTION_AUTOPLAY_USB_DESC + ' ' + 
                                (vm.userSettings.autoplayUsb ? 
                                        translations.OPTION_ENABLED : 
                                        translations.OPTION_DISABLED) + 
                                '.', translations.OPTION_SAVED);
                    });
                statusService.resetServerNotifications();
            }, function() {
                toastr.clear();
                $translate(['OPTION_SAVE_FAILED', 'OPTION_AUTOPLAY_USB_FAILED_DESC'])
                    .then(function(translations) {
                        toastr.error(translations.OPTION_AUTOPLAY_USB_FAILED_DESC, translations.OPTION_SAVE_FAILED, {
                            timeOut : 0,
                            extendedTimeOut : 0,
                            tapToDismiss : false,
                            closeButton : true
                        });
                    });
                statusService.resetServerNotifications();
            });
        }

        function addClusterUnit() {
            logger.debug('Add Cluster Unit');
            if (vm.newUnitIp.valid) {
                clusterService.addUnit(vm.newUnit.ip.value,
                                       vm.newUnit.port,
                                       vm.newUnit.delay);
                $translate(['NEW_CLUSTER_UNIT_ADDED_DESC', 'NEW_ADDED'])
                .then(function(translations) {
                    toastr.success(translations.NEW_CLUSTER_UNIT_ADDED_DESC, translations.NEW_ADDED);
                });
            }
            else {
                // Sticky toast
                $translate(['INVALID_SETTINGS', 'INVALID_CLUSTER_SETTINGS_DESC'])
                .then(function(translations) {
                    toastr.error(translations.INVALID_CLUSTER_SETTINGS_DESC, translations.INVALID_SETTINGS, {
                        timeOut : 0,
                        closeButton : true
                    });
                });
            }
        }

        function openReportModal() {
            logger.debug('open report modal');

            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/settings/report-problem-modal.html',
                controller: 'ReportProblemModalController',
                controllerAs: 'vm'
            });
        }

        function openClusterImportModal() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/settings/import-cluster-modal.html',
                controller: 'ImportClusterModalController',
                controllerAs: 'vm'
            });
        }

        function exportClusterConfig() {
            clusterService.exportConfig();
        }
    }
})();
