/*jshint maxcomplexity:15 */
/*jshint maxstatements:50 */
(function() {

    'use strict';

    angular.module('rameplayer.admin').controller(
            'AdminController', AdminController);

    AdminController.$inject = [
            '$log', 'dataService', 'toastr', '$rootScope'
    ];

    function AdminController($log, dataService, toastr, $rootScope) {
        var vm = this;
        vm.systemSettings = dataService.getSystemSettings();
        vm.audioPorts = [
            'rameAnalogOnly', 'rameHdmiOnly', 'rameHdmiAndAnalog'
        ];
        
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
            value: vm.systemSettings['ipGateway'],
            valid: true
        };
        vm.dnsServerIp = {
            value: vm.systemSettings['ipDnsPrimary'],
            valid: true
        };
        vm.dnsAlternativeServerIp = {
            value: vm.systemSettings['ipDnsSecondary'],
            valid: true
        };
        vm.dhcpServerRangeStartIp = {
            value: vm.systemSettings['ipDhcpRangeStart'],
            valid: true
        };
        vm.dhcpServerRangeEndIp = {
            value: vm.systemSettings['ipDhcpRangeEnd'],
            valid: true
        };
        vm.prefillDhcpOcts = prefillDhcpOcts;

        vm.saveSettings = saveSettings;
        vm.savingStatus = 'loaded';
        
        vm.isClusterMaster = false;
        vm.slaveIps = [];

        vm.ntpHostname = vm.systemSettings.ntpServerAddress;
        vm.useNtpIp = false;
        vm.ntpServerIp = {
            value : vm.systemSettings['ntpServerAddress'],
            valid : true
        };
        vm.timeInitially = vm.systemSettings.dateAndtimeInUTC;
        vm.useManualTimeConfigs = false;
        vm.manualTimeConfig = manualTimeConfig;
        vm.manualDateTime;
        vm.dateUserInput;
        vm.timeUserInput;

        vm.videoOutputResolutions = [
            'rameAutodetect',
            'rame720p50',
            'rame720p60',
            'rame1080i50',
            'rame1080i60',
            'rame1080p50',
            'rame1080p60'
        ];

        function saveSettings() {
            $log.debug('deviceIp', vm.deviceIp);
            var valid = true;
            var invalidFields = [];
            
            if (!vm.deviceName) {
                // Compliance to Internet standard specification RFC 1123
                // Match against regexp already done using ng-pattern
                //.match(/^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)*$/i)){
                invalidFields.push('Device hostname');
                valid = false;
            }  
            
            if (vm.manualIpConfig) {
                vm.systemSettings.ipDhcpClient = false;
                if (!vm.deviceIp.valid) {
                    invalidFields.push('IP address');
                }
                if (!vm.subnetMask.valid) {
                    invalidFields.push('Subnet mask');
                }
                /* 
                // TODO: ?? Should it be possible to leave these unset,
                // empty or zero, in case of not connected to Internet ?? 
                if (!gatewayIp) {
                    invalidFields.push('Gateway');
                }
                if (!dnsServerIp) {
                    invalidFields.push('Primary DNS server');
                }
                if (!dnsAlternativeServerIp) {
                    invalidFields.push('Secondary DNS server');
                }
                */
                if (vm.systemSettings.ipDhcpServer) {
                    var octets;
                    if (!vm.dhcpRangeStartIp.valid) {
                        invalidFields.push('DHCP Range Start');
                    }
                    else {
                        octets = vm.dhcpRangeStartIp.value.split('.');
                        if (octets[3] === '0') {
                            invalidFields.push('DHCP Range Start Not Allowed');
                        }
                    }

                    if (!vm.dhcpRangeEndIp.valid) {
                        invalidFields.push('DHCP Range End');
                    }
                    else {
                        octets = vm.dhcpRangeEndIp.value.split('.');
                        if (octets[3] === '255') {
                            invalidFields.push('DHCP Range End Not Allowed');
                        }
                    }

                    if (!validateIpOrdering(vm.dhcpServerRangeStartIp.value, vm.dhcpServerRangeEndIp.value)) {
                        invalidFields.push('DHCP Range Definition');
                    }                    
                }
            }
            
            if (vm.useManualTimeConfigs){
                if (vm.dateUserInput === undefined) {
                    invalidFields.push('Manual date');
                }
                if (vm.timeUserInput === undefined) {
                    invalidFields.push('Manual time');
                }
                vm.manualDateTime = validateManualDateTime(vm.dateUserInput, vm.timeUserInput);
            }
            else if (vm.useNtpIp && !vm.ntpServerIp.valid) {
                invalidFields.push('NTP Server IP');
            }
            
            if (invalidFields.length) {
                valid = false;
                // Sticky toast
                toastr.error(invalidFields.join(', '), 'Invalid settings', {
                    timeOut : 0,
                    closeButton: true
                });
            }
            
            if (valid) {
                vm.systemSettings.hostname = vm.deviceName;
                vm.systemSettings.ipDhcpClient = !vm.manualIpConfig;
                if (vm.manualIpConfig) {
                    vm.systemSettings.ipAddress = vm.deviceIp.value;
                    vm.systemSettings.ipSubnetMask = vm.subnetMask.value;
                    vm.systemSettings.ipGateway = vm.gatewayIp.value;
                    vm.systemSettings.ipDnsPrimary = vm.dnsServerIp.value;
                    vm.systemSettings.ipDnsSecondary = vm.dnsAlternativeServerIp.value;
                    if (vm.systemSettings.ipDhcpServer) {
                        vm.systemSettings.ipDhcpRangeStart = vm.dhcpRangeStartIp.value;
                        vm.systemSettings.ipDhcpRangeEnd = vm.dhcpRangeEndIp.value;
                    }
                }
                
                if (vm.manualTimeConfig){
                    vm.systemSettings.dateAndtimeInUTC = vm.manualDateTime;
                } else if (vm.useNtpIp){
                    vm.systemSettings.ntpServerAddress = vm.ntpServerIp;
                } else {
                    vm.systemSettings.ntpServerAddress = vm.ntpHostname;
                }
                vm.systemSettings.$save(function() {
                    vm.savingStatus = 'saved';
                    toastr.clear();
                    toastr.success('Admin settings saved.', 'Saved');
                });
            }
            else {
                toastr.error('Admin settings not saved.', 'Check inserted values');
            }
            //toastr.error('saveSettings: ' + $rootScope.rameExceptions, $rootScope.rameException);
            //throw new Error('testerror');
        }

        function validateIpOrdering(smallerIp, biggerIp) {
            // JS API: JavaScript Numbers are Always 64-bit Floating Point.
            // Bit operators work on 32-bit signed numbers.
            // Any numeric operand in the operation is converted into a 32-bit number.
            // Hence multiplication hack instead of bitwise operation.
            var smallerOcts = smallerIp.split('.');
            var biggerOcts = biggerIp.split('.');
            var small = smallerOcts[0] * 16777216 +
                smallerOcts[1] * 65536 + 
                smallerOcts[2] * 256 +
                smallerOcts[3]; 
            var big = biggerOcts[0] * 16777216 +
                biggerOcts[1] * 65536 +
                biggerOcts[2] * 256 +
                biggerOcts[3];
            
            return small <= big; 
        }
        
        function prefillDhcpOcts() {
            var octets = vm.deviceIp.value ? vm.deviceIp.value.split('.') : ['', '', '', ''];
            var ip = octets[0] + '.' + octets[1] + '.' + octets[2] + '.';
            vm.dhcpServerRangeStartIp.value = ip;
            vm.dhcpServerRangeEndIp.value = ip;
        }
        
        function manualTimeConfig() {
            vm.useManualTimeConfigs = !vm.useManualTimeConfigs;
            if(vm.useManualTimeConfigs){
                vm.useNtpIp = false;
            }
        }
        
        function validateManualDateTime(date, time){
            if (date != undefined && time != undefined){
                return (date + ' ' + time);
            }
            return undefined; 
        }
    }
})();
