(function() {

    'use strict';

    angular.module('rameplayer.admin').controller(
            'AdminController', AdminController);

    AdminController.$inject = [
            '$log', 'dataService', 'settings', '$exceptionHandler'
    ];

    function AdminController($log, dataService, settings, $exceptionHandler) {
        var vm = this;
        vm.audioPort = "Both";
        vm.audioPorts = [
                "XLR", "HDMI", "Both"
        ];

        vm.deviceName = "munRame";
        vm.ipAddress = "";
        vm.subnetMask = "";
        vm.gatewayIp = "";
        vm.dnsServerIp = "";
        vm.dnsAlternativeServerIp = "";
        vm.deviceIpOcts = [
                "10", "0", "0", "1"
        ];
        vm.subnetMaskOcts = [
                "255", "255", "255", "0"
        ];
        vm.gatewayIpOcts = [
                "172", "16", "0", "1"
        ];
        vm.dnsServerIpOcts = [
                "192", "168", "0", "1"
        ];
        vm.dnsAlternativeServerIpOcts = [
                "192", "168", "0", "254"
        ];

        vm.isDhcpClient = true;
        vm.isDhcpServer = false;

        vm.saveSettings = saveSettings;
        vm.savingStatus = "loaded";

        vm.isClusterMaster = false;
        vm.slaveIps = [];

        vm.videoOutputResolution = "720p50 (50 Hz)";
        vm.videoOutputResolutions = [
                "720p50 (50 Hz)", "720p60 (60 Hz)",
                "1080p30 (60 Hz)",
        ];



        function saveSettings() {
            vm.ipAddress = validateIP(vm.deviceIpOcts);
            vm.gatewayIp = validateIP(vm.gatewayIpOcts);
            vm.dnsServerIp = validateIP(vm.dnsServerIpOcts);
            vm.dnsAlternativeServerIp = validateIP(vm.dnsAlternativeServerIpOcts);
            vm.subnetMask = validateIP(vm.subnetMaskOcts);
            vm.savingStatus = "saved";
            console.log("fdjissdfafgawtd");
            throw new Error('flfl');
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

            return "Invalid IP address";
        }

    }

})();
