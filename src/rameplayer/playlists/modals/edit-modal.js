/*jshint bitwise: false*/
(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('EditModalController', EditModalController);

    EditModalController.$inject = ['$rootScope', '$timeout', '$log', '$uibModalInstance', 'logger',
        'listId', 'storageOptions', 'playlistIds', 'ListIds'];

    function EditModalController($rootScope, $timeout, $log, $uibModalInstance, logger,
                                 listId, storageOptions, playlistIds, ListIds) {
        var vm = this;

        var playlist = $rootScope.lists[listId];
        vm.title = playlist.title;
        vm.titleChanged = titleChanged;
        var tmpTitle = vm.title;
        var originalTitle = vm.title;

        var bootTitle = ListIds.AUTOPLAY;

        vm.storageOptions = storageOptions;
        vm.storage = playlist.storage || vm.storageOptions[0].value;
        vm.save = save;
        vm.cancel = cancel;
        vm.bootList = (vm.title === bootTitle);
        vm.bootListChanged = bootListChanged;
        vm.autoPlayChanged = autoPlayChanged;
        vm.titleExists = false;
        vm.autoPlayNext = (!!playlist.autoPlayNext); // convert to boolean
        vm.shufflePlay = playlist.shufflePlay;
        //logger.debug('Playlist shuffleplay for modal; ', vm.shufflePlay);
        //logger.debug('Playlist bootlist for modal; ', vm.bootlist);
        vm.scheduledList = (!!playlist.scheduled);
        vm.scheduledMonSun = (playlist.scheduledMonSun === undefined || playlist.scheduledMonSun.length < 7) ? 
                            [false, false, false, false, false, false, false] : playlist.scheduledMonSun;
        vm.scheduledOnMon = (!!vm.scheduledMonSun[0]);
        vm.scheduledOnTue = (!!vm.scheduledMonSun[1]);
        vm.scheduledOnWed = (!!vm.scheduledMonSun[2]);
        vm.scheduledOnThu = (!!vm.scheduledMonSun[3]);
        vm.scheduledOnFri = (!!vm.scheduledMonSun[4]);
        vm.scheduledOnSat = (!!vm.scheduledMonSun[5]);
        vm.scheduledOnSun = (!!vm.scheduledMonSun[6]);
        vm.timeUserInput = getScheduledTime(playlist);
        vm.getSecondsFromMidnight = getSecondsFromMidnight;
        //logger.debug('Playlist  for modal; ', playlist);

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
            //logger.debug('Playlist getSecondsFromMidnight for edit modal; ', vm.timeUserInput);
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

        function getScheduledTime(playlist) {
            var time = (playlist.scheduledTime === undefined) ? 0 : playlist.scheduledTime;
            // slice to pad with front zeros, |0 to keep it integer
            var res = ('0' + ((time / (60 * 60)) | 0)).slice(-2) + ':' +  
                      ('0' + (((time / 60) | 0) % 60)).slice(-2);
            if (time % 60 !== 0) {
                res = res + ':' + ('0' + time % 60).slice(-2);
            }
            //logger.debug('Playlist getSscheduledTime for modal; ', res);
            return res;
        }
    }
})();
