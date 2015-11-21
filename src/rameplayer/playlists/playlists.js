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
        statusService.provideFinder(findItem);

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
            dataService.removeFromDefaultPlaylist(media);
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

        function findItem(id) {
            for (var i = 0; i < vm.defaultPlaylist.items.length; i++) {
                if (id === vm.defaultPlaylist.items[i].id) {
                    return vm.defaultPlaylist.items[i];
                }
            }

            for (i = 0; i < vm.playlists.length; i++) {
                for (var j = 0; j < vm.playlists[i].items.length; j++) {
                    if (id === vm.playlists[i].items[j].id) {
                        return vm.playlists[i].items[j];
                    }
                }
            }
            // not found
            return null;
        }
    }
})();
