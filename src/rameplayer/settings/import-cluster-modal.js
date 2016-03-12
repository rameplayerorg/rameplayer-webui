(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .controller('ImportClusterModalController', ImportClusterModalController);

    ImportClusterModalController.$inject = ['logger', '$uibModalInstance', 'clusterService', 'toastr', '$translate'];

    function ImportClusterModalController(logger, $uibModalInstance, clusterService, toastr, $translate) {
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
                $translate(['CLUSTER_CONFIG_IMPORTED', 'CLUSTER_CONFIG_IMPORTED_SUCCESS_DESC'])
                .then(function(translations) {
                    toastr.success(translations.CLUSTER_CONFIG_IMPORTED_SUCCESS_DESC, 
                            translations.CLUSTER_CONFIG_IMPORTED);
                });
            }
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
