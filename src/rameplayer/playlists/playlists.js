(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('PlaylistsController', PlaylistsController);

    PlaylistsController.$inject = ['$log', 'dataService', 'playerService', '$uibModal', 'uuid'];

    function PlaylistsController($log, dataService, playerService, $uibModal, uuid) {
        var vm = this;

        vm.lists = [];
        vm.playlists = [];
        vm.defaultPlaylist = null;
        vm.selectedMedia = undefined;
        vm.selectMedia = selectMedia;
        vm.playerStatus = playerService.getStatus();
        vm.removeMedia = removeMedia;
        vm.playlistSorted = playlistSorted;
        vm.saveAs = saveAs;

        playerService.onMediaSelected(mediaSelected);
        playerService.onStatusChanged(statusChanged);
        playerService.onAddToPlaylist(addToPlaylist);

        loadDefaultPlaylist();
        loadPlaylists();

        function loadDefaultPlaylist() {
            vm.defaultPlaylist = dataService.getDefaultPlaylist();
            $log.info('Loading default playlist');
        }

        function loadPlaylists() {
            return getPlaylists();
        }

        function getPlaylists() {
            vm.playlists = dataService.getPlaylists();
            $log.info('Playlists loaded', vm.playlists);
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

        function addToPlaylist(mediaItem) {
            vm.defaultPlaylist.medias.push(mediaItem);
            $log.info('Media added to default playlist', mediaItem);
            vm.defaultPlaylist.$save();
        }

        function removeMedia(playlist, media) {
            $log.info('Remove media from playlist', playlist, media);
            for (var i = 0; i < playlist.medias.length; i++) {
                if (playlist.medias[i] === media) {
                    playlist.medias.splice(i, 1);
                    playlist.$save();
                }
            }
        }

        function saveAs(playlist) {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/save-as-modal.html',
                controller: 'SaveAsModalController',
                controllerAs: 'saveAs'
            });

            modalInstance.result.then(function(playlistTitle) {
                $log.info('Save playlist as', playlistTitle);
                var newPlaylist = angular.copy(playlist);
                newPlaylist.title = playlistTitle;
                $log.info('New playlist', newPlaylist);
                dataService.createPlaylist(newPlaylist);
            });
        }

        function playlistSorted(playlist, medias) {
            playlist.medias = medias;
            playlist.$save();
        }
    }
})();
