(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SaveAsModalController', SaveAsModalController);

    SaveAsModalController.$inject = ['$timeout', '$log', '$uibModalInstance'];

    function SaveAsModalController($timeout, $log, $uibModalInstance) {
        var vm = this;

        vm.playlistTitle = '';

        // TODO: Storage options should come from server
        vm.storageOptions = [
            {
                value: 'usb', name: 'USB 1'
            },
            {
                value: 'usb2', name: 'USB 2'
            },
            {
                value: 'browser', name: 'Browser'
            }
        ];
        vm.storage = vm.storageOptions[0].value;
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
            // validate form
            var valid = true;
            var $title = $('#newPlaylistTitle');
            // use browser's native html5 validation
            if (typeof $title[0].willValidate !== 'undefined') {
                valid = $title[0].checkValidity();
            }

            if (valid) {
                $uibModalInstance.close({
                    title: vm.playlistTitle,
                    storage: vm.storage
                });
            }
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
