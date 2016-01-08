(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('AddStreamModalController', AddStreamModalController);

    AddStreamModalController.$inject = ['$timeout', '$log', '$uibModalInstance'];

    function AddStreamModalController($timeout, $log, $uibModalInstance) {
        var vm = this;

        vm.url = '';
        vm.title = '';
        vm.save = save;
        vm.cancel = cancel;

        $uibModalInstance.opened.then(function() {
            // focus to input field
            // on mobile it opens keyboard mode automatically
            // have to wait until fade in is finished before focus works
            var delay = 500;
            $timeout(function() {
                $('#url').focus();
            }, delay);
        });

        function save() {
            $uibModalInstance.close({ url: vm.url, title: vm.title });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
