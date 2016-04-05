(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .directive('ramePlaylist', ramePlaylist);

    ramePlaylist.$inject = ['$rootScope', 'logger', '$uibModal', 'dataService', 'ListIds'];

    function ramePlaylist($rootScope, logger, $uibModal, dataService, ListIds) {
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
                group: 'source',
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
                },
                onRemove: function(evt) {
                    logger.info('Remove from playlist', vm.listId, evt.model);
                    vm.removeMedia(evt.model);
                },
                onAdd: function(evt) {
                    logger.info('Add to playlist', vm.listId, evt.model);
                    vm.addMedia(evt.model);
                }
            };
            vm.saveAs = saveAs;

            function saveAs() {
                // open modal dialog
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'rameplayer/playlists/modals/save-as-modal.html',
                    controller: 'SaveAsModalController',
                    controllerAs: 'saveAs'
                });

                modalInstance.result.then(function(result) {
                    logger.debug('Save playlist as', result.title);
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
                    logger.debug('New playlist', newPlaylist);
                    dataService.createPlaylist(newPlaylist);
                });
            }
        }
    }

    PlaylistController.$inject = ['$rootScope', '$scope', 'logger', '$uibModal', 'dataService',
        'clusterService', 'toastr', '$translate', '$timeout'];

    function PlaylistController($rootScope, $scope, logger, $uibModal, dataService,
                                clusterService, toastr, $translate, $timeout) {
        var vm = this;
        vm.isDropdownOpen = false;
        vm.remove = remove;
        vm.clear = clear;
        vm.addMedia = addMedia;
        vm.removeMedia = removeMedia;
        vm.edit = edit;
        vm.openSync = openSync;
        vm.openSyncModal = openSyncModal;
        vm.clusterUnits = clusterService.units;
        vm.sync = {
            units: [],
            targetVisible: false,
            isOn: false
        };

        // hovering functions for easier sync matching
        vm.hoverIndex = null;
        vm.mouseEnterItem = mouseEnterItem;
        vm.mouseLeaveItem = mouseLeaveItem;

        // watch clusterUnits - warning: this is heavy way
        $scope.$watch('vm.clusterUnits', function(newUnits) {
            // update vm.sync.units to have only those which have this list synced
            var units = [];
            for (var i = 0; i < newUnits.length; i++) {
                if (newUnits[i].syncedLists[vm.listId]) {
                    units.push(newUnits[i]);
                }
            }
            // sort sync lists by delay
            units.sort(function(a, b) {
                return a.delay - b.delay;
            });
            vm.sync.units = units;
            if (vm.sync.units.length > 0) {
                vm.sync.isOn = true;
                // wait animation to end before showing target list
                $timeout(function() {
                    vm.sync.targetVisible = true;
                }, 1100);
            }
            else {
                vm.sync.isOn = false;
                vm.sync.targetVisible = false;
            }
        }, true);

        function remove() {
            dataService.removePlaylist(vm.listId);

            // remove all synced lists
            for (var i = 0; i < vm.sync.units.length; i++) {
                if (vm.sync.units[i].syncedLists[vm.listId]) {
                    delete vm.sync.units[i].syncedLists[vm.listId];
                }
            }
        }

        function clear() {
            dataService.clearPlaylist(vm.listId);
        }

        function addMedia(media) {
            dataService.addToPlaylist(vm.listId, media);
        }

        function removeMedia(media) {
            dataService.removeFromPlaylist(vm.listId, media);
        }

        function edit() {
            // open modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/modals/edit-modal.html',
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
                logger.debug('Edit playlist', playlist);
                playlist.$save({
                    id: vm.listId
                });
            });
        }

        /**
         * @name openSync
         * @desc Opens existing synchronization
         */
        function openSync(unit) {
            startSync(unit, unit.syncedLists[vm.listId].targetList.id);
        }

        function openSyncModal() {
            // open sync modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/modals/sync-modal.html',
                controller: 'SyncModalController',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function(result) {
                if (result.unit && result.playlist) {
                    createSyncTarget(result.unit, result.playlist);
                }
            });
        }

        function createSyncTarget(unit, playlist) {
            var syncedList = {
                targetList: {
                    id: playlist,
                    refreshed: null
                },
                items: {}
            };
            unit.syncedLists[vm.listId] = syncedList;
        }

        function startSync(unit, playlist) {
            vm.sync.isOn = true;
            vm.sync.unit = unit;
        }

        function mouseEnterItem(index) {
            vm.hoverIndex = index;
        }

        function mouseLeaveItem(index) {
            vm.hoverIndex = null;
        }
    }
})();
