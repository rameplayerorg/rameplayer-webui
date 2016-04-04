(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .directive('ramePlaylistSyncTarget', ramePlaylistSyncTarget);

    function ramePlaylistSyncTarget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'E', // only element
            scope: {
                unit: '=',
                // get used playlist from attribute
                listId: '=?',
                hoverIndex: '=',
                onSort: '&',
            },
            templateUrl: 'rameplayer/playlists/playlist-sync-target.html',
            controller: PlaylistSyncTargetController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    PlaylistSyncTargetController.$inject = ['$rootScope', 'logger', 'clusterService', 'toastr', '$translate'];

    function PlaylistSyncTargetController($rootScope, logger, clusterService, toastr, $translate) {
        var vm = this;
        vm.targetItems = [];
        vm.removeSync = removeSync;
        vm.mouseEnterItem = mouseEnterItem;
        vm.mouseLeaveItem = mouseLeaveItem;

        vm.sortableOptions = {
            handle: '.sorting-handle',
            animation: 150,
            onSort: function(evt) {
                // triggered after sorting
                syncSort(evt);
            }
        };

        init();
        //logger.debug("sync playlist", vm.unit, vm.listId);

        function init() {
            var unitDs = clusterService.getDataService(vm.unit.id);
            // load playlist from other unit
            vm.targetList = unitDs.getList(vm.unit.syncedLists[vm.listId].targetList.id);
            vm.targetList.$promise.then(function() {
                // playlist loaded from other unit
                setSyncTargetItems();
            });
        }

        /**
         * @name syncSort
         * @desc Called when items in sync list have been sorted.
         */
        function syncSort(event) {
            saveSyncData();
        }

        function createTargetItems() {
            var targetItems = angular.copy(vm.targetList.items);
            for (var i = targetItems.length; i < $rootScope.lists[vm.listId].items.length; i++) {
                // fill target list with empty items until it's as big as source list
                targetItems.push(getEmptyItem());
            }
            return targetItems;
        }

        function setSyncTargetItems() {
            var targetItems = createTargetItems();
            if (Object.keys(vm.unit.syncedLists[vm.listId].items).length > 0) {

                // synced list exists
                var sourceItems = $rootScope.lists[vm.listId].items;
                var sorted = [];
                var i;
                for (i = 0; i < sourceItems.length; i++) {
                    var targetItemId = vm.unit.syncedLists[vm.listId].items[sourceItems[i].id];
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
            vm.targetItems = targetItems;

            if (Object.keys(vm.unit.syncedLists[vm.listId].items).length === 0) {
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
                targetList: {
                    id: vm.targetList.id,
                    refreshed: vm.targetList.refreshed
                },
                items: {}
            };
            var sourceItems = $rootScope.lists[vm.listId].items;
            for (var i = 0; i < sourceItems.length; i++) {
                syncedList.items[sourceItems[i].id] = vm.targetItems[i].id;
            }
            //logger.debug('syncedList', syncedList);
            vm.unit.syncedLists[vm.listId] = syncedList;
        }

        function getEmptyItem() {
            return {
                id: null,
                name: '–'
            };
        }

        function removeSync() {
            //closeSync();
            delete vm.unit.syncedLists[vm.listId];
            $translate(['PLAYLIST_SYNC_REMOVED']).then(function(translations) {
                var msg = translations.PLAYLIST_SYNC_REMOVED;
                msg = msg
                    .replace('$1', vm.unit.hostname + ' / ' + vm.targetList.title)
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
