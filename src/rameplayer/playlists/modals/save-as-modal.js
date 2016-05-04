(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SaveAsModalController', SaveAsModalController);

    SaveAsModalController.$inject = ['$rootScope', '$timeout', '$log', '$uibModalInstance',
        'ListIds', 'ItemTypes', 'storageOptions', 'playlistIds'];

    function SaveAsModalController($rootScope, $timeout, $log, $uibModalInstance,
                                   ListIds, ItemTypes, storageOptions, playlistIds) {
        var vm = this;

        vm.title = '';

        vm.storageOptions = storageOptions;
        vm.storage = vm.storageOptions[0].value;
        vm.save = save;
        vm.cancel = cancel;

        vm.titleChanged = titleChanged;
        var tmpTitle = vm.title;
        var originalTitle = vm.title;

        var bootTitle = ListIds.AUTOPLAY;
        vm.bootList = (vm.title === bootTitle);
        vm.bootListChanged = bootListChanged;
        vm.titleExists = false;

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
                    title: vm.title,
                    storage: vm.storage
                });
            }
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

        function titleChanged() {
            if (vm.title === bootTitle) {
                vm.bootList = true;
            }
            else {
                vm.bootList = false;
            }
            vm.titleExists = titleExists();
        }

        function bootListChanged() {
            if (vm.bootList) {
                tmpTitle = vm.title;
                vm.title = bootTitle;
            }
            else {
                if (tmpTitle === bootTitle) {
                    tmpTitle = '';
                }
                vm.title = tmpTitle;
            }
            vm.titleExists = titleExists();
        }

        function titleExists() {
            if (vm.title !== originalTitle) {
                for (var i = 0; i < playlistIds.length; i++) {
                    var list = $rootScope.lists[playlistIds[i]];
                    if (list.title !== originalTitle && list.title === vm.title) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
})();
