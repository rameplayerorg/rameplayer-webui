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
            var ipAddress, gatewayIp, dnsServerIp, dnsAlternativeServerIp, subnetMask;
            if (!vm.systemSettings.isDhcpClient) {
                ipAddress = validateIP(vm.deviceIpOcts);
                gatewayIp = validateIP(vm.gatewayIpOcts);
                dnsServerIp = validateIP(vm.dnsServerIpOcts);
                dnsAlternativeServerIp = validateIP(vm.dnsAlternativeServerIpOcts);
                subnetMask = validateIP(vm.subnetMaskOcts);

                var invalidFields = [];
                if (!ipAddress) {
                    invalidFields.push('IP address');
                }
                if (!subnetMask) {
                    invalidFields.push('Subnet mask');
                }
                if (!gatewayIp) {
                    invalidFields.push('Gateway');
                }
                if (!dnsServerIp) {
                    invalidFields.push('Primary DNS server');
                }
                if (!dnsAlternativeServerIp) {
                    invalidFields.push('Secondary DNS server');
                }
                if (invalidFields.length) {
                    toastr.error(invalidFields.join(', '), 'Invalid settings');
                    valid = false;
                }
            }
            if (valid) {
                if (!vm.systemSettings.isDhcpClient) {
                    vm.systemSettings.ipAddress = ipAddress;
                    vm.systemSettings.ipSubnetMask = subnetMask;
                    vm.systemSettings.ipGateway = gatewayIp;
                    vm.systemSettings.ipDnsPrimary = dnsServerIp;
                    vm.systemSettings.ipDnsSecondary = dnsAlternativeServerIp;
                }
                vm.systemSettings.$save(function() {
                    vm.savingStatus = 'saved';
                    toastr.success('Admin settings saved.', 'Saved');
                });
                // TODO: move toastr info/error to save result
                //toastr.error('saveSettings: ' + $rootScope.rameExceptions, $rootScope.rameException);
                //throw new Error('testerror');
            }
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

    }

})();
