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

    PlaylistController.$inject = ['$rootScope', 'logger', '$uibModal', 'dataService',
        'clusterService', 'toastr', '$translate', '$timeout'];

    function PlaylistController($rootScope, logger, $uibModal, dataService,
                                clusterService, toastr, $translate, $timeout) {
        var vm = this;
        vm.isDropdownOpen = false;
        vm.remove = remove;
        vm.clear = clear;
        vm.removeMedia = removeMedia;
        vm.edit = edit;
        vm.openSync = openSync;
        vm.openSyncModal = openSyncModal;
        vm.closeSync = closeSync;
        vm.removeSync = removeSync;
        vm.sync = {
            units: clusterService.units,
            targetVisible: false,
            isOn: false,
            unit: null,
            list: null,
            targetItems: [],
            sortableOptions: {
                handle: '.sorting-handle',
                animation: 150,
                onSort: function(evt) {
                    // triggered after sorting
                    syncSort(evt);
                }
            }
        };

        // hovering functions for easier sync matching
        vm.hoverIndex = null;
        vm.mouseEnterItem = mouseEnterItem;
        vm.mouseLeaveItem = mouseLeaveItem;

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
            startSync(unit, unit.syncedLists[vm.listId].targetListId);
        }

        function openSyncModal() {
            // open sync modal dialog
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rameplayer/playlists/sync-modal.html',
                controller: 'SyncModalController',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function(result) {
                vm.sync.list = null;
                if (result.unit && result.playlist) {
                    startSync(result.unit, result.playlist);
                }
            });
        }

        function startSync(unit, playlist) {
            vm.sync.isOn = true;
            vm.sync.unit = unit;
            var unitDs = clusterService.getDataService(unit.id);
            vm.sync.list = unitDs.getList(playlist);
            vm.sync.list.$promise.then(function() {
                // playlist loaded from other unit
                setSyncTargetItems();
            });

            // wait animation to end before showing target list
            $timeout(function() {
                vm.sync.targetVisible = true;
            }, 1000);

        }

        /**
         * @name syncSort
         * @desc Called when items in sync list have been sorted.
         */
        function syncSort(event) {
            saveSyncData();
        }

        function createTargetItems() {
            var targetItems = angular.copy(vm.sync.list.items);
            for (var i = targetItems.length; i < $rootScope.lists[vm.listId].items.length; i++) {
                // fill target list with empty items until it's as big as source list
                targetItems.push(getEmptyItem());
            }
            return targetItems;
        }

        function setSyncTargetItems() {

            var targetItems = createTargetItems();
            if (vm.sync.unit.syncedLists[vm.listId] !== undefined &&
                vm.sync.unit.syncedLists[vm.listId].targetListId === vm.sync.list.id) {

                // synced list exists
                var sourceItems = $rootScope.lists[vm.listId].items;
                var sorted = [];
                var i;
                for (i = 0; i < sourceItems.length; i++) {
                    var targetItemId = vm.sync.unit.syncedLists[vm.listId].items[sourceItems[i].id];
                    sorted.push(popTargetItem(targetItemId));
                }
                for (i = 0; i < targetItems.length; i++) {
                    // extend sorted array with remaining target items,
                    // ignoring empty target items
                    if (targetItems[i].id) {
                        sorted.push(targetItems[i]);
                    }
                }
                targetItems = sorted;
            }
            vm.sync.targetItems = targetItems;

            if (vm.sync.unit.syncedLists[vm.listId] === undefined) {
                // first save
                saveSyncData();
            }

            // finds given item and removes it from targetItems array,
            // or if not found, returns empty item
            function popTargetItem(itemId) {
                for (var i = 0; i < targetItems.length; i++) {
                    if (targetItems[i].id === itemId) {
                        return targetItems.splice(i, 1)[0];
                    }
                }
                return getEmptyItem();
            }
        }

        /**
         * @name saveSyncTargetItems
         * @desc Saves sync mapping data for unit object
         */
        function saveSyncData() {
            logger.debug('saveSyncData()');
            var syncedList = {
                targetListId: vm.sync.list.id,
                items: {}
            };
            var sourceItems = $rootScope.lists[vm.listId].items;
            for (var i = 0; i < sourceItems.length; i++) {
                syncedList.items[sourceItems[i].id] = vm.sync.targetItems[i].id;
            }
            logger.debug('syncedList', syncedList);
            vm.sync.unit.syncedLists[vm.listId] = syncedList;
        }

        function getEmptyItem() {
            return {
                id: null,
                name: '–'
            };
        }

        function closeSync() {
            vm.sync.targetVisible = false;
            vm.sync.isOn = false;
        }

        function removeSync() {
            closeSync();
            delete vm.sync.unit.syncedLists[vm.listId];
            $translate(['PLAYLIST_SYNC_REMOVED']).then(function(translations) {
                var msg = translations.PLAYLIST_SYNC_REMOVED;
                msg = msg
                    .replace('$1', vm.sync.unit.hostname + ' / ' + vm.sync.list.title)
                    .replace('$2', $rootScope.lists[vm.listId].title);
                toastr.success(msg);
            });
        }

        function mouseEnterItem(index) {
            vm.hoverIndex = index;
        }

        function mouseLeaveItem(index) {
            vm.hoverIndex = null;
        }
    }
})();
