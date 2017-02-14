(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('UploadModalController', UploadModalController);

    UploadModalController.$inject = ['logger', '$uibModalInstance', 'dataService', 'uploadService', 'listId'];

    function UploadModalController(logger, $uibModalInstance, dataService, uploadService, listId) {
        var vm = this;
        var sendUrl;

        vm.listId = listId;
        vm.uploader = uploadService.getUploader();
        vm.startUpload = startUpload;
        vm.cancel = cancel;
        vm.uploadUrl = dataService.getUploadUrl(listId);
        vm.uploader.onCompleteAll = onCompleteAll;

        function startUpload() {
            vm.uploader.uploadAll();
        }

        function cancel() {
            // remove all items from uploader
            vm.uploader.clearQueue();
            $uibModalInstance.dismiss();
        }

        function onCompleteAll() {
            var allSuccess = true;
            for (var i = 0; i < vm.uploader.queue.length; i++) {
                var item = vm.uploader.queue[i];
                if (!item.isSuccess) {
                    allSuccess = false;
                }
            }
            if (allSuccess) {
                vm.uploader.clearQueue();
                $uibModalInstance.close();
            }
        }
    }
})();
