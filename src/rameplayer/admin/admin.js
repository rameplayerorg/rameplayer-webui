(function() {

    'use strict';

    angular.module('rameplayer.admin').controller(
            'AdminController', AdminController);

    AdminController.$inject = [
            '$log', 'dataService', 'settings'
    ];

    function AdminController($log, dataService, settings) {
        var vm = this;
        vm.audioPort = "Both";
        vm.audioPorts = [
                "XLR", "HDMI", "Both"
        ];
        
        vm.deviceName = "munRame";

        vm.deviceIPocts = [
                "10", "0", "0", "1"
        ];
        vm.gatewayIPocts = [
                "172", "16", "0", "1"
        ];
        vm.dnsServerIPocts = [
                "192", "168", "0", "1"
        ];

        vm.ipAddress = "";
        vm.gatewayIp = "";
        vm.dnsServerIp = "";

        vm.isClusterMaster = false;
        vm.isDhcpClient = true;
        vm.isDhcpServer = false;
        vm.saveSettings = saveSettings;
        vm.savingStatus = "loaded";
        vm.slaveIps = [];
        vm.videoOutputResolution = "720p50";
        vm.videoOutputResolutions = [
                "720p50", "720p60", "1080p50", "1080p60",
        ];


        function saveSettings() {
            vm.ipAddress = validateIP(vm.deviceIPocts);
            vm.gatewayIp = validateIP(vm.gatewayIPocts);
            vm.dnsServerIp = validateIP(vm.dnsServerIPocts);
            vm.savingStatus = "saved";
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
