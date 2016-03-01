(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('ImportClusterModalController', ImportClusterModalController);

    ImportClusterModalController.$inject = ['logger', '$uibModalInstance', 'clusterService', 'toastr'];

    function ImportClusterModalController(logger, $uibModalInstance, clusterService, toastr) {
        var vm = this;

        vm.onFileRead = onFileRead;
        vm.importFile = importFile;
        vm.cancel = cancel;

        function onFileRead(data) {
            logger.debug('cluster config file read', data);
            vm.readData = data;
        }

        function importFile() {
            if (vm.readData !== undefined) {
                $uibModalInstance.close();
                clusterService.importConfig(vm.readData);
                toastr.success('Cluster configuration imported successfully.', 'Cluster Configuration Imported');
            }
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
