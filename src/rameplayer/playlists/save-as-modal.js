(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SaveAsModalController', SaveAsModalController);

    SaveAsModalController.$inject = ['$uibModalInstance'];

    function SaveAsModalController($uibModalInstance) {
        var vm = this;

        vm.playlistTitle = '';
        vm.save = save;
        vm.cancel = cancel;

        function save() {
            $uibModalInstance.close(vm.playlistTitle);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
