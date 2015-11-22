(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SaveAsModalController', SaveAsModalController);

    SaveAsModalController.$inject = ['$timeout', '$log', '$uibModalInstance'];

    function SaveAsModalController($timeout, $log, $uibModalInstance) {
        var vm = this;

        vm.playlistTitle = '';
        vm.save = save;
        vm.cancel = cancel;

        $uibModalInstance.opened.then(function() {
            // focus to input field
            // on mobile it opens keyboard mode automatically
            // have to wait until fade in is finished before focus works
            var delay = 500;
            $timeout(function() {
                $('#newPlaylistTitle').focus();
            }, delay);
        });

        function save() {
            $uibModalInstance.close(vm.playlistTitle);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
