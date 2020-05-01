/*jshint bitwise: false*/
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
        vm.autoPlayChanged = autoPlayChanged;
        vm.titleExists = false;
        vm.autoPlayNext = false;
        vm.shufflePlay = false;
        vm.scheduledList = false;
        vm.scheduledOnMon = false;
        vm.scheduledOnTue = false;
        vm.scheduledOnWed = false;
        vm.scheduledOnThu = false;
        vm.scheduledOnFri = false;
        vm.scheduledOnSat = false;
        vm.scheduledOnSun = false;
        vm.timeUserInput = '';
        vm.getSecondsFromMidnight = getSecondsFromMidnight;

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
                    storage: vm.storage,
                    autoPlayNext: vm.autoPlayNext,
                    shufflePlay: vm.shufflePlay,
                    scheduled: vm.scheduledList,
                    scheduledMonSun : [vm.scheduledOnMon, vm.scheduledOnTue,
                            vm.scheduledOnWed, vm.scheduledOnThu,
                            vm.scheduledOnFri, vm.scheduledOnSat,
                            vm.scheduledOnSun],
                    scheduledTime: vm.getSecondsFromMidnight(),
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
                vm.autoPlayNext = true;
                vm.scheduledList = false;
            }
            else {
                if (tmpTitle === bootTitle) {
                    tmpTitle = '';
                }
                vm.title = tmpTitle;
                vm.autoPlayNext = false;
                vm.shufflePlay = false;
            }
            vm.titleExists = titleExists();
        }
        
        function autoPlayChanged() {
            if (vm.shufflePlay && !vm.autoPlayNext) {
                vm.shufflePlay = false;
            }
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
        
        function getSecondsFromMidnight() {
            //$log.debug('Playlist getSecondsFromMidnight for SAVEAS modal; ', vm.timeUserInput);
            if (vm.timeUserInput !== undefined) {
                var hms = vm.timeUserInput.split(':');
                if (hms.length < 2 || hms.length > 3) {
                    return 0;
                }
                if (hms.length === 2) {
                    hms.push(0);
                }
                return (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]); // +infront to enforce number
            }
            return 0;
        }
    }
})();
