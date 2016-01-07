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
            "rameAnalogOnly", "rameHdmiOnly", "rameHdmiAndAnalog"
        ];

        vm.deviceName = "munRame";
        vm.deviceIpOcts = initOctets('ipAddress');
        vm.subnetMaskOcts = initOctets('ipSubnetMask');
        vm.gatewayIpOcts = initOctets('ipGateway');
        vm.dnsServerIpOcts = initOctets('ipDnsPrimary');
        vm.dnsAlternativeServerIpOcts = initOctets('ipDnsSecondary');
        vm.dhcpServerRangeStartIpOcts = initOctets('ipDhcpRangeStart');
        vm.dhcpServerRangeEndIpOcts = initOctets('ipDhcpRangeEnd');
        
        vm.prefillDhcpOcts = prefillDhcpOcts;

        vm.saveSettings = saveSettings;
        vm.savingStatus = "loaded";
        
        vm.isClusterMaster = false;
        vm.slaveIps = [];

        vm.videoOutputResolutions = [
            "rameAutodetect",
            "rame720p50",
            "rame720p60",
            "rame1080i50",
            "rame1080i60",
            "rame1080p50",
            "rame1080p60"
        ];

        function initOctets(field, def) {
            if (vm.systemSettings[field]) {
                return vm.systemSettings[field].split('.');
            }
            return def || ['', '', '', ''];
        }

        function saveSettings() {
            var valid = true;
            var ipAddress, gatewayIp, dnsServerIp, dnsAlternativeServerIp, subnetMask, 
                    dhcpRangeStart, dhcpRangeEnd, dhcpRangeValid;
            if (!vm.systemSettings.ipDhcpClient) {
                ipAddress = validateIP(vm.deviceIpOcts);
                gatewayIp = validateIP(vm.gatewayIpOcts);
                dnsServerIp = validateIP(vm.dnsServerIpOcts);
                dnsAlternativeServerIp = validateIP(vm.dnsAlternativeServerIpOcts);
                subnetMask = validateIP(vm.subnetMaskOcts);
                dhcpRangeStart = validateIP(vm.dhcpServerRangeStartIpOcts);
                dhcpRangeEnd = validateIP(vm.dhcpServerRangeEndIpOcts);                
                dhcpRangeValid = validateIpOrdering(vm.dhcpServerRangeStartIpOcts, vm.dhcpServerRangeEndIpOcts);

                var invalidFields = [];
                if (!ipAddress) {
                    invalidFields.push('IP address');
                }
                if (!subnetMask) {
                    invalidFields.push('Subnet mask');
                }
                /* 
                // TODO: ?? Should it be possible to leave these unset, empty or zero, in case of not connected to Internet ?? 
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
                if(vm.systemSettings.ipDhcpServer){
                    if (!dhcpRangeStart) {
                        invalidFields.push('DHCP Range Start');
                    }
                    if (!dhcpRangeEnd) {
                        invalidFields.push('DHCP Range End');
                    }
                    if (vm.dhcpServerRangeStartIpOcts[3] == 0) {
                        // TODO: ?? Is this really illegal range value, always broadcast or always first server ?? 
                        invalidFields.push('DHCP Range Start Not Allowed');
                    }
                    if (vm.dhcpServerRangeEndIpOcts[3] == 255) {
                        // TODO: ?? Is this really illegal range value, always broadcast or always first server ?? 
                        invalidFields.push('DHCP Range End Not Allowed');
                    }
                    if(!dhcpRangeValid){
                        invalidFields.push('DHCP Range Definition');
                    }                    
                }
                
                if (invalidFields.length) {
                    toastr.error(invalidFields.join(', '), 'Invalid settings');
                    valid = false;
                }
            }
            if (valid) {
                if (!vm.systemSettings.ipDhcpClient) {
                    vm.systemSettings.ipAddress = ipAddress;
                    vm.systemSettings.ipSubnetMask = subnetMask;
                    vm.systemSettings.ipGateway = gatewayIp;
                    vm.systemSettings.ipDnsPrimary = dnsServerIp;
                    vm.systemSettings.ipDnsSecondary = dnsAlternativeServerIp;
                    if(vm.systemSettings.ipDhcpServer){
                        vm.systemSettings.ipDhcpRangeStart = dhcpRangeStart;
                        vm.systemSettings.ipDhcpRangeEnd = dhcpRangeEnd;
                    }
                }
                vm.systemSettings.$save(function() {
                    vm.savingStatus = 'saved';
                    toastr.success('Admin settings saved.', 'Saved');
                });
            }
            //toastr.error('saveSettings: ' + $rootScope.rameExceptions, $rootScope.rameException);
            //throw new Error('testerror');
        }

        // IP address string regexp
        // val.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
        function validateIP(octs) {
            var addr = "";

            for (var i = 0; i < octs.length; i++) {
                addr = addr + octs[i];
                if (i != octs.length - 1) {
                    addr = addr + ".";
                }
            }

            if (addr
                    .match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
            {
                return addr;
            }

            return null;
        }
        
        function validateIpOrdering(smallerOcts, biggerOcts) {
            var small = smallerOcts[0] * 16777216 
                    + smallerOcts[1] * 65536 
                    + smallerOcts[2] * 256 
                    + smallerOcts[3]; 
            var big = biggerOcts[0] * 16777216 
                    + biggerOcts[1] * 65536 
                    + biggerOcts[2] * 256 
                    + biggerOcts[3];
            
            return small <= big; 
		}
        
        function prefillDhcpOcts() {
            vm.dhcpServerRangeStartIpOcts[0] = vm.dhcpServerRangeEndIpOcts[0] = vm.deviceIpOcts[0];
            vm.dhcpServerRangeStartIpOcts[1] = vm.dhcpServerRangeEndIpOcts[1] = vm.deviceIpOcts[1];
            vm.dhcpServerRangeStartIpOcts[2] = vm.dhcpServerRangeEndIpOcts[2] = vm.deviceIpOcts[2];
            vm.dhcpServerRangeStartIpOcts[3] = vm.dhcpServerRangeEndIpOcts[3] = null;
		}

    }

})();
