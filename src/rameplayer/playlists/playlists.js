(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('PlaylistsController', PlaylistsController);

    PlaylistsController.$inject = ['$log', 'dataService', 'playerService', 'uuid'];

    function PlaylistsController($log, dataService, playerService, uuid) {
        var vm = this;

        vm.lists = [];
        vm.playlists = [];
        vm.defaultPlaylist = null;
        vm.selectedMedia = undefined;
        vm.selectMedia = selectMedia;
        vm.playerStatus = playerService.getStatus();
        vm.removeMedia = removeMedia;
        vm.playlistSorted = playlistSorted;

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

        function playlistSorted(playlist, medias) {
            playlist.medias = medias;
            playlist.$save();
        }
    }
})();
