/*jshint maxcomplexity:40 */
/*jshint maxstatements:54 */
(function() {

    'use strict';

    angular.module('rameplayer.admin').controller(
            'AdminController', AdminController);

    AdminController.$inject = [
            'logger', 'dataService', 'toastr', '$rootScope', '$translate', 'statusService',
            '$uibModal'
    ];

    function AdminController(logger, dataService, toastr, $rootScope, $translate, statusService,
                             $uibModal) {
        var vm = this;
        vm.systemSettings = dataService.getSystemSettings();
        vm.systemSettings.$promise.then(function() {
            init();
        });

        vm.audioPorts = [
            'rameAnalogOnly', 'rameHdmiOnly', 'rameHdmiAndAnalog'
        ];
        vm.prefillDhcpOcts = prefillDhcpOcts;
        vm.saveSettings = saveSettings;
        vm.confirmFactoryReset = confirmFactoryReset;
        vm.confirmRestart = confirmRestart;
        vm.savingStatus = 'loaded';
        vm.useNtpIp = false;
        vm.useManualTimeConfigs = false;
        vm.manualTimeConfig = manualTimeConfig;
        vm.manualDateTime = null;
        vm.dateUserInput = null;
        vm.timeUserInput = null;

        vm.videoOutputResolutions = [
            'rameAutodetect',
            // Old legacy entries:
            //'rame720p50',
            //'rame720p60',
            //'rame1080i50',
            //'rame1080i60',
            //'rame1080p50',
            //'rame1080p60',
            // CEA
            // Most used CEA resolutions first
            'rameCEA19_720p50',
            'rameCEA4_720p60',
            'rameCEA31_1080p50',
            'rameCEA16_1080p60',
            'rameCEA20_1080i50',
            'rameCEA5_1080i60',
            // The rest of CEA, in custom order
            'rameCEA39_1080i50rb',
            'rameCEA34_1080p30',
            'rameCEA33_1080p25',
            'rameCEA32_1080p24',
            'rameCEA40_1080i100',
            'rameCEA46_1080i120',
            'rameCEA41_720p100',
            'rameCEA47_720p120',
            'rameCEA17_576p50',
            'rameCEA18_576p50w',
            'rameCEA21_576i50',
            'rameCEA22_576i50w',
            'rameCEA25_576i50pq',
            'rameCEA26_576i50pqw',
            'rameCEA29_576p50pd',
            'rameCEA30_576p50pdw',
            'rameCEA37_576p50pq',
            'rameCEA38_576p50pqw',
            'rameCEA42_576p100',
            'rameCEA43_576p100w',
            'rameCEA44_576i100',
            'rameCEA45_576i100w',
            'rameCEA52_576p200',
            'rameCEA53_576p200w',
            'rameCEA54_576i200',
            'rameCEA55_576i200w',
            'rameCEA2_480p60',
            'rameCEA3_480p60w',
            'rameCEA6_480i60',
            'rameCEA7_480i60w',
            'rameCEA10_480i60pq',
            'rameCEA11_480i60pqw',
            'rameCEA14_480p60pd',
            'rameCEA15_480p60pdw',
            'rameCEA35_480p60pq',
            'rameCEA36_480p60pqw',
            'rameCEA1_VGA640x480',
            'rameCEA48_480p120',
            'rameCEA49_480p120w',
            'rameCEA50_480i120',
            'rameCEA51_480i120w',
            'rameCEA56_480p240',
            'rameCEA57_480p240w',
            'rameCEA58_480i240',
            'rameCEA59_480i240w',
            'rameCEA23_288p50',
            'rameCEA24_288p50w',
            'rameCEA27_288p50pq',
            'rameCEA28_288p50pqw',
            'rameCEA8_240p60',
            'rameCEA9_240p60w',
            'rameCEA12_240p60pq',
            'rameCEA13_240p60pqw',
            // DMT
            // Typical DMT resolutions first
            'rameDMT82_1920x1080x60', // 1080p
            'rameDMT85_1280x720x60', // 720p
            // The rest of DMT
            // note: DMT modes 34,38,45,50,53-56,59-67,69-80,84 go over RPi pixel clock limit
            // note: DMT mode 15 is not RPi compatible
            'rameDMT68_1920x1200rb',
            'rameDMT51_1600x1200x60',
            'rameDMT52_1600x1200x65',
            'rameDMT57_1680x1050rb',
            'rameDMT58_1680x1050x60',
            'rameDMT83_1600x900rb',
            'rameDMT46_1440x900rb',
            'rameDMT47_1440x900x60',
            'rameDMT48_1440x900x75',
            'rameDMT49_1440x900x85',
            'rameDMT41_1400x1050rb',
            'rameDMT42_1400x1050x60',
            'rameDMT43_1400x1050x75',
            'rameDMT44_1400x1050x85',
            'rameDMT81_1366x768x60',
            'rameDMT86_1366x768rb',
            'rameDMT39_1360x768x60',
            'rameDMT40_1360x768x120rb',
            'rameDMT35_1280x1024x60',
            'rameDMT36_1280x1024x75',
            'rameDMT37_1280x1024x85',
            'rameDMT32_1280x960x60',
            'rameDMT33_1280x960x85',
            'rameDMT27_1280x800rb',
            'rameDMT28_1280x800x60',
            'rameDMT29_1280x800x75',
            'rameDMT30_1280x800x85',
            'rameDMT31_1280x800x120rb',
            'rameDMT22_1280x768rb',
            'rameDMT23_1280x768x60',
            'rameDMT24_1280x768x75',
            'rameDMT25_1280x768x85',
            'rameDMT26_1280x768x120rb',
            'rameDMT21_1152x864x75',
            'rameDMT16_1024x768x60',
            'rameDMT17_1024x768x70',
            'rameDMT18_1024x768x75',
            'rameDMT19_1024x768x85',
            'rameDMT20_1024x768x120',
            'rameDMT14_848x480x60',
            'rameDMT8_800x600x56',
            'rameDMT9_800x600x60',
            'rameDMT10_800x600x72',
            'rameDMT11_800x600x75',
            'rameDMT12_800x600x85',
            'rameDMT13_800x600x120',
            'rameDMT3_720x400x85',
            'rameDMT4_640x480x60',
            'rameDMT5_640x480x72',
            'rameDMT6_640x480x75',
            'rameDMT7_640x480x85',
            'rameDMT2_640x400x85',
            'rameDMT1_640x350x85',
            'rameDMT87_custom',
            'rameAnalogPAL',
            'rameAnalogPALBrazil',
            'rameAnalogPALProgressive',
            'rameAnalogNTSC',
            'rameAnalogNTSCJapan',
            'rameAnalogNTSCProgressive'
        ];

        vm.videoOutputRotations = [
            {
                value: 0,
                name: '0'
            }, {
                value: 90,
                name: '90'
            }, {
                value: 180,
                name: '180'
            },
            {
                value: 270,
                name: '270'
            }
        ];

        /**
         * @name init
         * @description Initializes variables.
         * Called after system settings are fetched from server.
         */
        function init() {
            logger.debug('System settings fetched for init', vm.systemSettings);

            vm.selectedVideoOutputRotation = vm.videoOutputRotations[0]; // default
            for (var a = 0; a < vm.videoOutputRotations.length; ++a) {
                if (vm.videoOutputRotations[a].value === vm.systemSettings.displayRotation)
                {
                    vm.selectedVideoOutputRotation = vm.videoOutputRotations[a];
                    break;
                }
            }

            vm.manualIpConfig = !vm.systemSettings.ipDhcpClient;
            vm.deviceName = vm.systemSettings.hostname;

            vm.deviceIp = {
                value: vm.systemSettings['ipAddress'],
                valid: true
            };
            vm.subnetMask = {
                value: vm.systemSettings['ipSubnetMask'],
                valid: true
            };
            vm.gatewayIp = {
                value: vm.systemSettings['ipDefaultGateway'],
                valid: true
            };
            vm.dnsServerIp = {
                value: vm.systemSettings['ipDnsPrimary'],
                valid: true
            };
            vm.dnsAlternativeServerIp = {
                value: vm.systemSettings['ipDnsSecondary'],
                valid: true,
                optional: true
            };
            vm.dhcpServerRangeStartIp = {
                value: vm.systemSettings['ipDhcpRangeStart'],
                valid: true
            };
            vm.dhcpServerRangeEndIp = {
                value: vm.systemSettings['ipDhcpRangeEnd'],
                valid: true
            };

            vm.ntpServerAddress = vm.systemSettings.ntpServerAddress;
            vm.ntpServerIp = {
                value : vm.systemSettings['ntpServerAddress'],
                valid : true
            };
            vm.timeInitially = vm.systemSettings.dateAndTimeInUTC;
        }

        function saveSettings() {
            var valid = true;
            var invalidFields = [];
            var invalidOptionalFields = [];

            if (!vm.deviceName) {
                // Compliance to Internet standard specification RFC 1123
                // Match against regexp already done using ng-pattern
                //.match(/^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)*$/i)){
                invalidFields.push('DEVICE_HOSTNAME');
                valid = false;
            }  
            
            if (vm.manualIpConfig) {
                //logger.debug(vm.dnsAlternativeServerIp.value + ' ' + vm.systemSettings.ipDnsSecondary);
                vm.systemSettings.ipDhcpClient = false;
                if (!vm.deviceIp || !vm.deviceIp.valid) {
                    invalidFields.push('DEVICE_IP');
                }
                if (!vm.subnetMask || !vm.subnetMask.valid) {
                    invalidFields.push('SUBNET_MASK');
                }
                if (!vm.gatewayIp || (!vm.gatewayIp.valid && vm.gatewayIp.value !== undefined)) {
                    invalidOptionalFields.push('GATEWAY_IP');
                }
                if (!vm.dnsServerIp || (!vm.dnsServerIp.valid && vm.dnsServerIp.value !== undefined)) {
                    invalidOptionalFields.push('DNS_FIRST');
                }
                if (!vm.dnsAlternativeServerIp ||
                    (!vm.dnsAlternativeServerIp.valid && vm.dnsAlternativeServerIp.value !== undefined)) {
                    invalidOptionalFields.push('DNS_SECOND');
                }
                if (vm.systemSettings.ipDhcpServer) {
                    var octets;
                    if (vm.dhcpServerRangeStartIp) {
                        if (!vm.dhcpServerRangeStartIp.valid) {
                            invalidFields.push('DHCP_RANGE_START');
                        }
                        else {
                            octets = vm.dhcpServerRangeStartIp.value.split('.');
                            if (octets[3] === '0') {
                                invalidFields.push('DHCP_RANGE_START');
                            }
                        }
                    } else {
                        invalidFields.push('DHCP_RANGE_START');
                    }
                    if (vm.dhcpServerRangeEndIp) {
                        if (!vm.dhcpServerRangeEndIp.valid) {
                            invalidFields.push('DHCP_RANGE_END');
                        }
                        else {
                            octets = vm.dhcpServerRangeEndIp.value.split('.');
                            if (octets[3] === '255') {
                                invalidFields.push('DHCP_RANGE_END');
                            }
                        }
                    } else {
                        invalidFields.push('DHCP_RANGE_END');
                    }
                    if (vm.dhcpServerRangeStartIp && vm.dhcpServerRangeEndIp) {
                        if (!validateIpOrdering(vm.dhcpServerRangeStartIp.value, vm.dhcpServerRangeEndIp.value)) {
                            invalidFields.push('DHCP_RANGE_DEF');
                        }
                    }
                }
            }
            
            if (vm.useManualTimeConfigs) {
                if (!vm.dateUserInput) {
                    invalidFields.push('MANUAL_DATE');
                }
                if (!vm.timeUserInput) {
                    invalidFields.push('MANUAL_TIME');
                }
                vm.manualDateTime = validateManualDateTime(vm.dateUserInput, vm.timeUserInput);
            }
            else if (!vm.ntpForm.ntpHostname.$valid) {
                invalidFields.push('NTP_SERVER_HOSTNAME');
            }
            // logger.info(basicsForm.deviceName.$valid);
            // logger.info($('#ntpHostname').$valid);
            // logger.info(vm.ntpForm.ntpHostname.$valid);
            // logger.info(vm.ntpServerAddress);
            
            if (invalidOptionalFields.length) {
                $translate(['INVALID_OPTIONAL_SETTINGS']).then(function(tr) {
                    $translate(invalidOptionalFields).then(function(trf) {
                        var msg = '';
                        for (var i = 0; i < invalidOptionalFields.length; i++) {
                            msg += trf[invalidOptionalFields[i]];
                            if (invalidOptionalFields.length > 1 && i < invalidOptionalFields.length - 1) {
                                msg += ', ';
                            }
                        }
                        toastr.warning(msg, tr.INVALID_OPTIONAL_SETTINGS);
                    });
                });
            }
            
            if (invalidFields.length) {
                valid = false;
                $translate(['INVALID_SETTINGS']).then(function(tr) {
                    $translate(invalidFields).then(function(trf) {
                        var msg = '';
                        for (var i = 0; i < invalidFields.length; i++) {
                            msg += trf[invalidFields[i]];
                            if (invalidFields.length > 1 && i < invalidFields.length - 1) {
                                msg += ', ';
                            }
                        }
                        // Sticky toast
                        toastr.error(msg, tr.INVALID_SETTINGS, {
                            timeOut : 0,
                            closeButton: true
                        });
                    });
                });
            }
            
            if (valid) {
                assignSystemSettings();
                vm.systemSettings
                        .$save(function(response) {
                            vm.savingStatus = 'saved';
                            logger.debug('Admin setting save success, response: ', response);
                            toastr.success('Admin settings saved.', 'Saved');
                            statusService.resetServerNotifications();
                            init();
                        }, function(response) {
                            logger.error('Admin setting save failed, response status:' + 
                                    response.status + ' (' + response.statusText + ') data.error:' +
                                    (response.data ? response.data.error : ' (data is null)'));
                            logger.debug(response);
                            toastr.error('Saving admin settings failed.', 'Saving failed', {
                                timeOut : 10000,
                                closeButton : true
                            });
                            statusService.resetServerNotifications();
                            //throw new Error(response.status + ' ' + response.statusText, response.data.error); 
                        });
            }
            else {
                $translate(['CHECK_INSERTED_VALUES', 'ADMIN_SETTINGS_NOT_SAVED'])
                    .then(function(tr) {
                    toastr.error(tr.ADMIN_SETTINGS_NOT_SAVED, tr.CHECK_INSERTED_VALUES);
                });
            }
            //toastr.error('saveSettings: ' + $rootScope.rameExceptions, $rootScope.rameException);
            //throw new Error('testerror');
        }
        
        function assignSystemSettings() {
            if (vm.selectedVideoOutputRotation) {
                vm.systemSettings.displayRotation = vm.selectedVideoOutputRotation.value;
            }
            vm.systemSettings.hostname = vm.deviceName;
            vm.systemSettings.ipDhcpClient = !vm.manualIpConfig;
            if (vm.manualIpConfig) {
                if (vm.deviceIp) {
                    vm.systemSettings.ipAddress = vm.deviceIp.value;
                }
                if (vm.subnetMask) {
                    vm.systemSettings.ipSubnetMask = vm.subnetMask.value;
                }
                if (vm.gatewayIp && vm.gatewayIp.valid) {
                    vm.systemSettings.ipDefaultGateway = vm.gatewayIp.value;
                } else {
                    // optional
                    vm.systemSettings.ipDefaultGateway = undefined;
                }
                if (vm.dnsServerIp && vm.dnsServerIp.valid) {
                    vm.systemSettings.ipDnsPrimary = vm.dnsServerIp.value;
                } else {
                    // optional
                    vm.systemSettings.ipDnsPrimary = undefined;
                }
                if (vm.dnsAlternativeServerIp && vm.dnsAlternativeServerIp.valid) {
                    vm.systemSettings.ipDnsSecondary = vm.dnsAlternativeServerIp.value;
                } else {
                    // optional
                    vm.systemSettings.ipDnsSecondary = undefined;
                }
                //logger.debug(vm.dnsAlternativeServerIp.value + ' ' + vm.systemSettings.ipDnsSecondary);
                if (vm.systemSettings.ipDhcpServer && vm.dhcpServerRangeStartIp && vm.dhcpServerRangeEndIp) {
                    if (vm.dhcpServerRangeStartIp.valid && vm.dhcpServerRangeEndIp.valid) {
                        vm.systemSettings.ipDhcpRangeStart = vm.dhcpServerRangeStartIp.value;
                        vm.systemSettings.ipDhcpRangeEnd = vm.dhcpServerRangeEndIp.value;
                    }
                }
            }
            
            if (vm.useManualTimeConfigs) {
                vm.systemSettings.dateAndTimeInUTC = vm.manualDateTime;
                vm.systemSettings.ntpServerAddress = undefined;
            } else {
                vm.systemSettings.dateAndTimeInUTC = undefined;
                if (vm.useNtpIp) {
                    vm.systemSettings.ntpServerAddress = vm.ntpServerIp;
                } else {
                    vm.systemSettings.ntpServerAddress = vm.ntpServerAddress;
                }
            }
            
            logger.debug('System settings after assigned for save', vm.systemSettings);
        }
        
        function validateIpOrdering(smallerIp, biggerIp) {
            if (!smallerIp || !biggerIp) {
                return false;
            }
            // JS API: JavaScript Numbers are Always 64-bit Floating Point.
            // Bit operators work on 32-bit signed numbers.
            // Any numeric operand in the operation is converted into a 32-bit number.
            // Hence multiplication hack instead of bitwise operation.
            var smallerOcts = smallerIp.split('.');
            var biggerOcts = biggerIp.split('.');
            var small = smallerOcts[0] * 16777216 +
                smallerOcts[1] * 65536 + 
                smallerOcts[2] * 256 +
                smallerOcts[3] * 1;
            var big = biggerOcts[0] * 16777216 +
                biggerOcts[1] * 65536 +
                biggerOcts[2] * 256 +
                biggerOcts[3] * 1;
            return small <= big;
        }
        
        function prefillDhcpOcts() {
            if (vm.deviceIp) {
                var octets = vm.deviceIp.value ? vm.deviceIp.value.split('.') : ['', '', '', ''];
                var ip = octets[0] + '.' + octets[1] + '.' + octets[2] + '.';
                vm.dhcpServerRangeStartIp.value = ip;
                vm.dhcpServerRangeEndIp.value = ip;
            }
        }
        
        function manualTimeConfig() {
            vm.useManualTimeConfigs = !vm.useManualTimeConfigs;
            if (vm.useManualTimeConfigs) {
                vm.useNtpIp = false;
            }
        }
        
        function validateManualDateTime(date, time) {
            if (date != undefined && time != undefined) { // jshint ignore:line
                return (date + ' ' + time);
            }
            return undefined;
        }

        function confirmRestart() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/admin/restart-modal.html',
                controller: 'RestartModalController',
                controllerAs: 'vm',
            });
        }

        function confirmFactoryReset() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/admin/factory-reset-modal.html',
                controller: 'FactoryResetModalController',
                controllerAs: 'vm',
            });
        }
    }
})();
