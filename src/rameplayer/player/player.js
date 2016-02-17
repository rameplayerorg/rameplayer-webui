(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$rootScope', '$scope', '$log', '$timeout', 'statusService',
        'dataService', 'clusterService'];

    function PlayerController($rootScope, $scope, $log, $timeout, statusService, dataService, clusterService) {
        var vm = this;

        $(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        vm.timeSlider = 0;
        vm.playerStatus = statusService.status;
        vm.cursorItem = null;
        vm.statusErrorPromise = null;
        vm.statusError = null;
        vm.togglePlay = togglePlay;
        vm.stop = stop;
        vm.stepForward = stepForward;
        vm.seek = seek;
        vm.clusterService = clusterService;

        $scope.$watchCollection('vm.playerStatus', function() {
            // synchronize time slider with status position
            vm.timeSlider = vm.playerStatus.position;

            // update vm.cursorItem only when it's changed
            if (vm.playerStatus.cursor && vm.playerStatus.cursor.id) {
                if (!vm.cursorItem || vm.playerStatus.cursor.id !== vm.cursorItem.id) {
                    vm.cursorItem = findCursorItem(statusService.status.cursor);
                }
            }
            else {
                vm.cursorItem = null;
            }
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
            clusterService.play();
        }

        function pause() {
            clusterService.pause();
        }

        function stop() {
            clusterService.stop();
        }

        function stepBackward() {
            dataService.stepBackward();
        }

        function stepForward() {
            dataService.stepForward();
        }

        function seek(position) {
            $log.debug('player.seek', position);
            clusterService.seek(position);
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

        function findCursorItem(cursor) {
            var id = cursor.parentId;
            if ($rootScope.lists[id] && $rootScope.lists[id].items) {
                for (var i = 0; i < $rootScope.lists[id].items.length; i++) {
                    if (cursor.id === $rootScope.lists[id].items[i].id) {
                        return $rootScope.lists[id].items[i];
                    }
                }
            }
            // not found
            return null;
        }
    }
})();
