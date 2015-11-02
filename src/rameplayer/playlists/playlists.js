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
        vm.sortableMediaOptions = {
            handle: '.sorting-handle',
            animation: 150,
            onUpdate: function() {
                $log.info('Playlist changed');
            }
        };

        vm.selectedMedia = undefined;
        vm.selectMedia = selectMedia;
        vm.playerStatus = playerService.getStatus();

        playerService.onMediaSelected(mediaSelected);
        playerService.onStatusChanged(statusChanged);

        loadDefaultPlaylist();
        loadPlaylists();

        function loadDefaultPlaylist() {
            vm.defaultPlaylist = dataService.getDefaultPlaylist();
            $log.info('Loading default playlist');
        }

        function loadPlaylists() {
            return getPlaylists();
        }

        function findWorkPlaylist() {
            angular.forEach(vm.lists, function(list, i) {
                if (list.title === workPlaylistTitle) {
                    vm.workPlaylist = list;
                    vm.lists.splice(i, 1);
                    return;
                }
            });
            // create work playlist
            vm.workPlaylist = {
                uri: 'rameplayer://playlist/' + uuid.v4(),
                title: workPlaylistTitle,
                medias: [],
            };
            $log.info('New work playlist', vm.workPlaylist);
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
    }
})();
