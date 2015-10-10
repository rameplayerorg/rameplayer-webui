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
        vm.playerStatus = playerService.getStatus();

        playerService.onMediaSelected(mediaSelected);
        playerService.onStatusChanged(statusChanged);

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

        function statusChanged(playerStatus) {
            $log.info('MediaController: status changed', playerStatus);
            vm.playerStatus = playerStatus;
        }
    }
})();
