(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', '$timeout', 'statusService', 'dataService'];

    function PlayerController($log, $timeout, statusService, dataService) {
        var vm = this;

        vm.timeSlider = 0;
        vm.playerStatus = statusService.status;
        vm.statusErrorPromise = null;
        vm.statusError = null;
        vm.togglePlay = togglePlay;
        vm.toggleStop = toggleStop;
        vm.seek = seek;

        function togglePlay() {
            if (vm.playerStatus.state === statusService.states.playing) {
                pause();
            }
            else {
                play();
            }
        }

        function play() {
            var media = vm.selectedMedia;
            dataService.play().then(function(data) {
                $log.info('Response', data);
            });
        }

        function pause() {
            dataService.pause().then(function(data) {
                $log.info('Response', data);
            });
        }

        function toggleStop() {
            if (vm.playerStatus.state === statusService.states.playing) {
                stop();
            }
            else {
                stepBackward();
            }
        }

        function stop() {
            dataService.stop().then(function(data) {
                $log.info('Response', data);
            });
        }

        function stepBackward() {
        }

        function seek() {
            var position = vm.timeSlider;
            dataService.seek(position).then(function(data) {
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
