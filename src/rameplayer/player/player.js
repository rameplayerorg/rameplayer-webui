(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$scope', '$log', '$timeout', 'statusService', 'dataService'];

    function PlayerController($scope, $log, $timeout, statusService, dataService) {
        var vm = this;

        vm.timeSlider = 0;
        vm.playerStatus = statusService.status;
        vm.statusErrorPromise = null;
        vm.statusError = null;
        vm.togglePlay = togglePlay;
        vm.toggleStop = toggleStop;
        vm.stepForward = stepForward;
        vm.seek = seek;

        $scope.$watchCollection('vm.playerStatus', function() {
            // synchronize time slider with status position
            vm.timeSlider = vm.playerStatus.position;
        });

        function togglePlay() {
            if (vm.playerStatus.state === statusService.states.playing ||
                vm.playerStatus.state === statusService.states.buffering) {
                pause();
            }
            else {
                play();
            }
        }

        function play() {
            var media = vm.selectedMedia;
            dataService.play().then(function(data) {
            });
        }

        function pause() {
            dataService.pause().then(function(data) {
            });
        }

        function toggleStop() {
            if (vm.playerStatus.state === statusService.states.playing ||
                vm.playerStatus.state === statusService.states.buffering) {
                stop();
            }
            else {
                stepBackward();
            }
        }

        function stop() {
            dataService.stop().then(function(data) {
            });
        }

        function stepBackward() {
            dataService.stepBackward();
        }

        function stepForward() {
            dataService.stepForward();
        }

        function seek() {
            var position = parseFloat(vm.timeSlider);
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
