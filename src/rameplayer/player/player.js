(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', '$timeout', 'playerService', 'dataService'];

    function PlayerController($log, $timeout, playerService, dataService) {
        var vm = this;

        vm.timeSlider = 0;
        vm.selectedMedia = null;
        vm.playerStatus = playerService.getStatus();
        vm.statusErrorPromise = null;
        vm.statusError = null;
        vm.addToPlaylist = addToPlaylist;
        vm.togglePlay = togglePlay;
        vm.toggleStop = toggleStop;
        vm.seek = seek;

        playerService.onMediaSelected(mediaSelected);
        playerService.onStatusChanged(statusChanged);
        playerService.onPollerError(pollerError);

        function addToPlaylist() {
            if (vm.selectedMedia) {
                playerService.addToPlaylist(vm.selectedMedia);
            }
        }

        function togglePlay() {
            if (vm.playerStatus.state === playerService.states.playing) {
                pause();
            }
            else {
                play();
            }
        }

        function play() {
            var media = vm.selectedMedia;
            playerService.changeStatus(playerService.states.playing, media);
            dataService.play(media).then(function(data) {
                $log.info('Response', data);
            });
        }

        function pause() {
            playerService.changeStatus(playerService.states.paused, vm.playerStatus.media);
            dataService.pause().then(function(data) {
                $log.info('Response', data);
            });
        }

        function toggleStop() {
            if (vm.playerStatus.state === playerService.states.playing) {
                stop();
            }
            else {
                stepBackward();
            }
        }

        function stop() {
            playerService.changeStatus(playerService.states.stopped);
            dataService.stop().then(function(data) {
                $log.info('Response', data);
            });
        }

        function stepBackward() {
        }

        function seek() {
            var position = vm.timeSlider;
            dataService.seek(position).then(function(data) {
                $log.info('Response', data);
            });
        }

        function mediaSelected(media) {
            vm.selectedMedia = media;
        }

        function statusChanged(playerStatus) {
            vm.playerStatus = playerStatus;
            vm.timeSlider = vm.playerStatus.position ? vm.playerStatus.position : 0;
        }

        function pollerError(errorResponse) {
            vm.statusError = errorResponse.status;
            if (vm.statusErrorTimeout) {
                $timeout.cancel(vm.statusErrorTimeout);
            }
            vm.statusErrorTimeout = $timeout(function() {
                vm.statusError = null;
            }, 3000);
        }
    }
})();
