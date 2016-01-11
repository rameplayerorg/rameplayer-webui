(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .directive('ramePlaylist', ramePlaylist);

    ramePlaylist.$inject = ['$rootScope', '$log', '$uibModal', 'dataService', 'ListIds'];

    function ramePlaylist($rootScope, $log, $uibModal, dataService, ListIds) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E', // only element
            scope: {
                // get used playlist from attribute
                targetId: '=',
                onMediaClick: '&',
                //removeMedia: '&',
                onSort: '&',
                addStream: '&'
            },
            templateUrl: 'rameplayer/playlists/playlist.html',
            controller: PlaylistController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        function link(scope, element, attrs, vm) {
            vm.lists = $rootScope.lists;
            vm.isDefaultPlaylist = (attrs.default !== undefined);
            if (vm.isDefaultPlaylist) {
                vm.targetId = ListIds.DEFAULT_PLAYLIST;
            }
            vm.defaultPlaylist = vm.isDefaultPlaylist ? 'true' : 'false';
            vm.sortableOptions = {
                handle: '.sorting-handle',
                animation: 150,
                onSort: function(evt) {
                    // triggered after sorting
                    vm.onSort({
                        targetId: vm.targetId,
                        item: evt.model,
                        oldIndex: evt.oldIndex,
                        newIndex: evt.newIndex
                    });
                }
            };
            vm.saveAs = saveAs;

            function saveAs() {
                // open modal dialog
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'rameplayer/playlists/save-as-modal.html',
                    controller: 'SaveAsModalController',
                    controllerAs: 'saveAs'
                });

                modalInstance.result.then(function(playlistTitle) {
                    $log.info('Save playlist as', playlistTitle);
                    // server needs only some fields for playlist saving
                    var newPlaylist = {
                        info: {
                            title: playlistTitle
                        },
                        items: []
                    };
                    for (var i = 0; i < $rootScope.lists[vm.targetId].items.length; i++) {
                        newPlaylist.items.push({
                            id: $rootScope.lists[vm.targetId].items[i].id
                        });
                    }
                    $log.info('New playlist', newPlaylist);
                    dataService.createPlaylist(newPlaylist);
                });
            }
        }
    }

    PlaylistController.$inject = ['dataService'];

    function PlaylistController(dataService) {
        var vm = this;
        vm.isDropdownOpen = false;
        vm.remove = remove;
        vm.clear = clear;
        vm.removeMedia = removeMedia;

        function remove() {
            dataService.removePlaylist(vm.targetId);
        }

        function clear() {
            dataService.clearPlaylist(vm.targetId);
        }

        function removeMedia(media) {
            dataService.removeFromPlaylist(vm.targetId, media);
        }
    }

})();
