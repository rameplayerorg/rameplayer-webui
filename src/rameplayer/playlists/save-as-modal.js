(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SaveAsModalController', SaveAsModalController);

    SaveAsModalController.$inject = ['$rootScope', '$timeout', '$log', '$uibModalInstance',
        'ListIds', 'ItemTypes'];

    function SaveAsModalController($rootScope, $timeout, $log, $uibModalInstance,
                                   ListIds, ItemTypes) {
        var vm = this;

        vm.playlistTitle = '';

        vm.storageOptions = getStorageOptions();
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

        /**
         * @name getStorageOptions
         * @description Makes a list of suitable storage options.
         * Collects all devices under root list.
         * @return Array
         */
        function getStorageOptions() {
            var options = [];
            for (var i = 0; i < $rootScope.lists[ListIds.ROOT].items.length; i++) {
                var item = $rootScope.lists[ListIds.ROOT].items[i];
                if (item.type === ItemTypes.DEVICE) {
                    options.push({
                        value: item.id,
                        name: $rootScope.lists[item.id].title
                    });
                }
            }
            return options;
        }

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
