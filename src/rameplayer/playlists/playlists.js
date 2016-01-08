(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('PlaylistsController', PlaylistsController);

    PlaylistsController.$inject = ['$scope', '$log', 'dataService', 'statusService', '$uibModal', 'uuid'];

    function PlaylistsController($scope, $log, dataService, statusService, $uibModal, uuid) {
        var vm = this;

        vm.lists = [];
        vm.playlists = [];
        vm.defaultPlaylist = null;
        vm.playerStatus = statusService.status;
        vm.selectMedia = selectMedia;
        vm.removeMedia = removeMedia;
        vm.playlistSorted = playlistSorted;
        vm.saveAs = saveAs;
        vm.addStream = addStream;

        $scope.$watchCollection('vm.playerStatus', function(current, original) {
            // update playlists if newer versions available
            if (!original || !original.lists || current.playlists.modified > original.playlists.modified) {
                loadDefaultPlaylist();
                loadPlaylists();
            }
        });

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

        function mediaSelected(mediaItem) {
            vm.selectedMedia = mediaItem;
        }

        function statusChanged(playerStatus) {
            vm.playerStatus = playerStatus;
        }

        function selectMedia(mediaItem) {
            dataService.setCursor(mediaItem.id);
        }

        function removeMedia(playlist, media) {
            $log.info('Remove media from playlist', playlist, media);
            dataService.removeFromPlaylist(media, playlist);
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

        function addStream(playlist) {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/add-stream-modal.html',
                controller: 'AddStreamModalController',
                controllerAs: 'saveAs'
            });

            modalInstance.result.then(function(params) {
                var newItem = {
                    title: params.title,
                    uri: params.url
                };
                dataService.addToPlaylist(newItem, playlist);
            });
        }

        function playlistSorted(playlist, item, oldIndex, newIndex) {
            dataService.movePlaylistItem(playlist, item, oldIndex, newIndex);
        }
    }
})();
