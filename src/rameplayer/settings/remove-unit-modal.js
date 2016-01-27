(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('RemoveUnitModalController', RemoveUnitModalController);

    RemoveUnitModalController.$inject = ['$log', '$uibModalInstance', 'unitHostname'];

    function RemoveUnitModalController($log, $uibModalInstance, unitHostname) {
        var vm = this;

        vm.unitHostname = unitHostname;
        vm.remove = remove;
        vm.cancel = cancel;

        function remove() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
