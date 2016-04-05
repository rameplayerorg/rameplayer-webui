(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('RemoveSyncTargetModalController', RemoveSyncTargetModalController);

    RemoveSyncTargetModalController.$inject = ['$uibModalInstance', 'playlist'];

    function RemoveSyncTargetModalController($uibModalInstance, playlist) {
        var vm = this;

        vm.playlist = playlist;
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
