/*jshint maxparams:12 */

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
                // all playlist ids
                listIds: '=?',
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
                filter: '.sortable-ignored',
                animation: 150,
                onUpdate: function(evt) {
                    logger.info('Item moved in playlist', vm.listId, evt);
                    if (evt.model) {
                        // triggered after sorting
                        vm.onSort({
                            id: vm.listId,
                            item: evt.model,
                            afterId: indexToAfterId(evt.newIndex)
                        });
                    }
                },
                onRemove: function(evt) {
                    logger.info('Remove from playlist', vm.listId, evt.model);
                    vm.removeMedia(evt.model);
                },
                onAdd: function(evt) {
                    logger.info('Add to playlist', vm.listId, evt.model, evt.oldIndex, evt.newIndex);
                    vm.addMedia(evt.model, indexToAfterId(evt.newIndex));
                }
            };
            vm.saveAs = saveAs;

            function saveAs() {
                // open modal dialog
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'rameplayer/playlists/modals/save-as-modal.html',
                    controller: 'SaveAsModalController',
                    controllerAs: 'saveAs',
                    resolve: {
                        storageOptions: function() {
                            return vm.getStorageOptions();
                        },
                        playlistIds: function() {
                            return vm.listIds;
                        }
                    }
                });

                modalInstance.result.then(function(result) {
                    logger.debug('Save playlist as', result.title);
                    // server needs only some fields for playlist saving
                    var newPlaylist = {
                        title: result.title,
                        storage: result.storage,
                        autoPlayNext: result.autoPlayNext,
                        repeat: (result.autoPlayNext ? -1 : 0),
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

            /**
             * Converts index from Sortable lib to afterId param
             */
            function indexToAfterId(index) {
                if (index > 0) {
                    return $rootScope.lists[vm.listId].items[index - 1].id;
                }
                return null;
            }
        }
    }

    PlaylistController.$inject = ['$rootScope', '$scope', 'logger', '$uibModal', 'dataService',
        'clusterService', 'toastr', '$translate', '$timeout', 'ListIds', 'ItemTypes', 'listProvider'];

    function PlaylistController($rootScope, $scope, logger, $uibModal, dataService,
                                clusterService, toastr, $translate, $timeout, ListIds, ItemTypes, listProvider) {
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
        vm.getStorageOptions = getStorageOptions;

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

        function addMedia(media, afterId) {
            dataService.addToPlaylist(vm.listId, media, afterId);
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
                    },
                    storageOptions: function() {
                        return vm.getStorageOptions();
                    },
                    playlistIds: function() {
                        return vm.listIds;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                var playlist = $rootScope.lists[vm.listId];
                playlist.title = result.title;
                playlist.storage = result.storage;
                playlist.autoPlayNext = result.autoPlayNext;
                playlist.repeat = result.autoPlayNext ? -1 : 0;
                logger.debug('Edit playlist', playlist);
                playlist.update();
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

        /**
         * @name getStorageOptions
         * @description Makes a list of suitable storage options.
         * Collects all devices under root list.
         * @return Array
         */
        function getStorageOptions() {
            var options = [];
            for (var i = 0; i < $rootScope.lists[ListIds.ROOT].items.length; i++) {
                var item = $rootScope.lists[ListIds.ROOT].items[i];
                if (item.type === ItemTypes.DEVICE) {
                    options.push({
                        value: item.id,
                        name: $rootScope.lists[item.id].title
                    });
                }
            }
            return options;
        }

    }
})();
