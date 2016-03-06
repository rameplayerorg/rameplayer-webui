(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('UpgradeFirmwareModalController', UpgradeFirmwareModalController);

    UpgradeFirmwareModalController.$inject = ['$log', '$uibModalInstance'];

    function UpgradeFirmwareModalController($log, $uibModalInstance) {
        var vm = this;

        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
