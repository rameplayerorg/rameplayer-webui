/**
 * Rameplayer-WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * List Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('listService', listService);

    listService.$inject = ['$rootScope', '$log', 'dataService', 'ItemTypes', 'ListIds'];

    /**
     * @namespace ListService
     * @desc Application wide service for lists
     * @memberof Factories
     */
    function listService($rootScope, $log, dataService, ItemTypes, ListIds) {

        // data holder for flattened list of all List resource objects
        // key is list targetId and value is List instance
        $rootScope.lists = {};

        var service = {
            add: add,
            refresh: refresh,
            remove: remove
        };

        // begin by fetching root list
        var rootList = add(ListIds.ROOT);

        // then fetch all children for root
        rootList.$promise.then(function() {
            for (var i = 0; i < rootList.items.length; i++) {
                if (rootList.items[i].info.type === ItemTypes.LIST) {
                    add(rootList.items[i].targetId);
                }
            }
        });

        // fetch default playlist
        add(ListIds.DEFAULT_PLAYLIST);

        return service;

        function add(targetId) {
            if ($rootScope.lists[targetId] !== undefined) {
                // already added
                return $rootScope.lists[targetId];
            }
            var list = dataService.getList(targetId);
            $rootScope.lists[targetId] = list;
            $log.info('ListService: list "' + targetId + '" added to $rootScope.lists');
            return list;
        }

        function refresh(targetId) {
            var list = dataService.getList(targetId);
            list.$promise.then(function() {
                $rootScope.lists[targetId] = list;
            });
            return list;
        }

        function remove(id) {
            delete $rootScope.lists[id];
            $log.info('ListService: list "' + id + '" removed from $rootScope.lists');
        }
    }
})();
