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

    listService.$inject = ['$rootScope', 'logger', 'dataService', 'ItemTypes', 'ListIds'];

    /**
     * @namespace ListService
     * @desc Application wide service for lists
     * @memberof Factories
     */
    function listService($rootScope, logger, dataService, ItemTypes, ListIds) {

        // data holder for flattened list of all List resource objects
        // key is list listId and value is List instance
        $rootScope.lists = {};

        var service = {
            add: add,
            refresh: refresh,
            remove: remove
        };

        // begin by fetching root list
        var rootList = add(ListIds.ROOT);

        // then fetch all devices under root
        rootList.$promise.then(function() {
            for (var i = 0; i < rootList.items.length; i++) {
                if (rootList.items[i].type === ItemTypes.DEVICE) {
                    add(rootList.items[i].id);
                }
            }
        });

        // fetch default playlist
        add(ListIds.DEFAULT_PLAYLIST);

        return service;

        function add(id) {
            if ($rootScope.lists[id] !== undefined) {
                // already added
                return $rootScope.lists[id];
            }
            var list = dataService.getList(id);
            $rootScope.lists[id] = list;
            logger.info('ListService: list "' + id + '" added to $rootScope.lists');
            return list;
        }

        function refresh(id) {
            var list = dataService.getList(id);
            list.$promise.then(function() {
                $rootScope.lists[id] = list;
            });
            return list;
        }

        function remove(id) {
            delete $rootScope.lists[id];
            logger.info('ListService: list "' + id + '" removed from $rootScope.lists');
        }
    }
})();
