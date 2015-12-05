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

    listService.$inject = ['$rootScope', '$log', 'dataService', 'statusService', 'ItemTypes'];

    /**
     * @namespace ListService
     * @desc Application wide service for lists
     * @memberof Factories
     */
    function listService($rootScope, $log, dataService, statusService, ItemTypes) {

        // data holder for flattened list of all List resource objects
        // key is list targetId and value is List instance
        $rootScope.lists = {};

        var rootListId = 'root';
        var service = {
            add: add,
            refresh: refresh,
            remove: remove
        }

        // begin by fetching root list
        var rootList = add(rootListId);

        // then fetch all children for root
        rootList.$promise.then(function() {
            for (var i = 0; i < rootList.items.length; i++) {
                if (rootList.items[i].info.type === ItemTypes.LIST) {
                    add(rootList.items[i].targetId);
                }
            }
        });

        return service;

        function add(targetId) {
            if ($rootScope.lists[targetId] !== undefined) {
                return $rootScope.lists[targetId];
            }
            var list = dataService.getList(targetId);
            $rootScope.lists[targetId] = list;
            return list;
        }

        function refresh(id) {
            return add(id);
        }

        function remove(id) {
            delete $rootScope.lists[id];
        }
    }
})();
