(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('MediaController', MediaController);

    MediaController.$inject = ['$log', 'dataService', 'playerService'];

    function MediaController($log, dataService, playerService) {
        var vm = this;
        vm.lists = [];

        vm.selectedMedia = undefined;
        vm.selectMedia = selectMedia;
        vm.playingMedia = null;
        vm.playerState = undefined;

        playerService.onMediaSelected(mediaSelected);
        playerService.onStateChanged(stateChanged);

        loadLists();

        function loadLists() {
            return getMedias().then(function() {
                $log.info('Lists loaded', vm.lists);
            });
        }

        function getMedias() {
            return dataService.getLists().then(function(data) {
                vm.lists = data.data;
                return vm.lists;
            });
        }

        function selectMedia(mediaItem) {
            playerService.selectMedia(mediaItem);
        }

        function mediaSelected(mediaItem) {
            vm.selectedMedia = mediaItem;
        }

        function stateChanged(state) {
            $log.info('MediaController: state changed to', state);
            vm.playerState = state;
            vm.playingMedia = playerService.getPlayingMedia();
        }
    }
})();
