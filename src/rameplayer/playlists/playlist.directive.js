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
                listId: '=?',
                onMediaClick: '&',
                //removeMedia: '&',
                onSort: '&',
                addStream: '&?'
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
                vm.listId = ListIds.DEFAULT_PLAYLIST;
            }
            vm.defaultPlaylist = vm.isDefaultPlaylist ? 'true' : 'false';
            vm.sortableOptions = {
                handle: '.sorting-handle',
                animation: 150,
                onSort: function(evt) {
                    // triggered after sorting
                    vm.onSort({
                        id: vm.listId,
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

                modalInstance.result.then(function(result) {
                    $log.debug('Save playlist as', result.title);
                    // server needs only some fields for playlist saving
                    var newPlaylist = {
                        title: result.title,
                        storage: result.storage,
                        items: []
                    };
                    for (var i = 0; i < $rootScope.lists[vm.listId].items.length; i++) {
                        var item = $rootScope.lists[vm.listId].items[i];
                        newPlaylist.items.push({
                            uri: item.uri,
                            title: item.title
                        });
                    }
                    $log.debug('New playlist', newPlaylist);
                    dataService.createPlaylist(newPlaylist);
                });
            }
        }
    }

    PlaylistController.$inject = ['$rootScope', '$log', '$uibModal', 'dataService'];

    function PlaylistController($rootScope, $log, $uibModal, dataService) {
        var vm = this;
        vm.isDropdownOpen = false;
        vm.remove = remove;
        vm.clear = clear;
        vm.removeMedia = removeMedia;
        vm.edit = edit;

        function remove() {
            dataService.removePlaylist(vm.listId);
        }

        function clear() {
            dataService.clearPlaylist(vm.listId);
        }

        function removeMedia(media) {
            dataService.removeFromPlaylist(vm.listId, media);
        }

        function edit() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/edit-modal.html',
                controller: 'EditModalController',
                controllerAs: 'vm',
                resolve: {
                    listId: function() {
                        return vm.listId;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                var playlist = $rootScope.lists[vm.listId];
                playlist.title = result.title;
                playlist.storage = result.storage;
                $log.debug('Edit playlist', playlist);
                playlist.$save({
                    id: vm.listId
                });
            });
        }
    }
})();
