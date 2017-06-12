(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$rootScope', '$scope', '$log', '$timeout', 'statusService',
        'dataService', 'clusterService', '$document'];

    function PlayerController($rootScope, $scope, $log, $timeout, statusService,
                              dataService, clusterService, $document) {
        var vm = this;
        var keyDown = false;

        $(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        vm.timeSlider = 0;
        vm.statusService = statusService;
        vm.playerStatus = statusService.status;
        vm.cursorItem = null;
        vm.togglePlay = togglePlay;
        vm.playOnRepeat = playOnRepeat;
        vm.stop = stop;
        vm.stepForward = stepForward;
        vm.seek = seek;
        vm.clusterService = clusterService;
        vm.jumpForm = {
            open: false,
            hour: 0,
            min: 0,
            sec: 0,
            jump: jump
        };

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

        bindShortcuts();

        function bindShortcuts() {
            // use keyDown flag to prevent multiple
            // events when pressing key down long time
            $document.on('keydown', function(e) {
                if (e.key === 'F8' && !keyDown) {
                    keyDown = true;
                    e.preventDefault();
                    togglePlay();
                }
                else if (e.key === 'F9' && !keyDown) {
                    keyDown = true;
                    e.preventDefault();
                    playOnRepeat();
                }
                else if (e.key === 'F10' && !keyDown) {
                    keyDown = true;
                    e.preventDefault();
                    stop();
                }
            });

            $document.on('keyup', function(e) {
                if (e.key === 'F8' || e.key === 'F9' || e.key === 'F10') {
                    keyDown = false;
                }
            });
        }

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

        function playOnRepeat() {
            clusterService.playOnRepeat();
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

        /**
         * @name jump
         * @description Called from the form in position popover.
         */
        function jump() {
            var position = vm.jumpForm.hour * 3600 + vm.jumpForm.min * 60 + vm.jumpForm.sec;
            clusterService.seek(position);
            vm.jumpForm.open = false;
        }
    }
})();
