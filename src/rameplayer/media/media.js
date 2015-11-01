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
                var sortable = new Sortable($('.media-list-sortable')[0], {
                    handle: '.sorting-handle',
                    animation: 150,
                    onUpdate: function() {
                        $log.info('Playlist changed');
                    }
                });
            });
        }

        function getMedias() {
            return dataService.getLists().then(function(data) {
                vm.lists = data.data.lists;
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
            vm.playerStatus = playerStatus;
        }
    }
})();
