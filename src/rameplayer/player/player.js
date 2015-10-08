(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', 'playerService', 'dataService'];

    function PlayerController($log, playerService, dataService) {
        var vm = this;

        vm.selectedMedia = null;
        vm.playingMedia = null;
        vm.state = undefined;
        vm.togglePlay = togglePlay;

        playerService.onMediaSelected(mediaSelected);
        playerService.onStateChanged(stateChanged);

        function togglePlay() {
            if (vm.state === playerService.states.playing) {
                playerService.setPlayerState(playerService.states.paused);
                dataService.pause().then(function(data) {
                    $log.info('Response', data);
                });
            }
            else {
                playerService.setPlayerState(playerService.states.playing);
                dataService.play(vm.selectedMedia).then(function(data) {
                    $log.info('Response', data);
                });
                vm.playingMedia = vm.selectedMedia;
            }
        }

        function mediaSelected(media) {
            vm.selectedMedia = media;
        }

        function stateChanged(state) {
            vm.state = state;
        }
    }
})();
