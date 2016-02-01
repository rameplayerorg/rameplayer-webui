(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('PlaylistsController', PlaylistsController);

    PlaylistsController.$inject = ['$rootScope', '$scope', '$log', 'dataService',
        'statusService', 'listService', '$uibModal', 'uuid', 'ItemTypes'];

    function PlaylistsController($rootScope, $scope, $log, dataService,
                                 statusService, listService, $uibModal, uuid, ItemTypes) {
        var vm = this;

        vm.lists = [];
        vm.playlists = [];
        vm.defaultPlaylist = null;
        vm.playerStatus = statusService.status;
        vm.selectMedia = selectMedia;
        vm.removeMedia = removeMedia;
        vm.playlistSorted = playlistSorted;
        vm.addStream = addStream;

        $rootScope.$watchCollection('lists', function(lists) {
            $log.info('Playlists: $rootScope.lists changed', lists);
            if (lists['root']) {
                lists['root'].$promise.then(function(rootList) {
                    updatePlaylists();
                });
            }
        });

        function updatePlaylists() {
            var rootList = $rootScope.lists['root'];
            var playlists = [];
            for (var i = 0; i < rootList.items.length; i++) {
                if (rootList.items[i].type === ItemTypes.PLAYLIST) {
                    var id = rootList.items[i].id;
                    // make sure playlist is loaded
                    var playlist = $rootScope.lists[id] || listService.add(id);
                    playlists.push(id);
                }
            }
            $log.info('Playlists refreshed: ', playlists);
            vm.playlists = playlists;
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

        function removeMedia(listId, media) {
            $log.info('Remove media from playlist', listId, media);
            dataService.removeFromPlaylist(listId, media);
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
                dataService.addStreamToPlaylist(playlist, newItem);
            });
        }

        function playlistSorted(playlist, item, oldIndex, newIndex) {
            var afterId = null;
            if (newIndex > 0) {
                var prev = $rootScope.lists[playlist].items[newIndex - 1];
                afterId = prev.id;
            }
            dataService.movePlaylistItem(playlist, item, afterId);
        }
    }
})();
