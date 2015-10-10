(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', 'playerService', 'dataService'];

    function PlayerController($log, playerService, dataService) {
        var vm = this;

        vm.selectedMedia = null;
        vm.playerStatus = playerService.getStatus();
        vm.togglePlay = togglePlay;

        playerService.onMediaSelected(mediaSelected);
        playerService.onStatusChanged(statusChanged);

        function togglePlay() {
            if (vm.playerStatus.state === playerService.states.playing) {
                playerService.changeStatus(playerService.states.paused, vm.playerStatus.media);
                dataService.pause().then(function(data) {
                    $log.info('Response', data);
                });
            }
            else {
                playerService.changeStatus(playerService.states.playing, vm.selectedMedia);
                dataService.play(vm.selectedMedia).then(function(data) {
                    $log.info('Response', data);
                });
            }
        }

        function mediaSelected(media) {
            vm.selectedMedia = media;
        }

        function statusChanged(playerStatus) {
            vm.playerStatus = playerStatus;
        }
    }
})();
