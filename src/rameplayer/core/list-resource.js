/**
 * Rameplayer WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * Lis Resource
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('List', List);

    List.$inject = ['$log', '$resource', '$rootScope', 'settings', 'ItemTypes'];

    /**
     * @namespace List
     * @desc Resource for List
     * @memberof Factories
     */
    function List($log, $resource, $rootScope, settings, ItemTypes) {

        var url = settings.urls.lists + '/:targetId';
        if (settings.development && settings.development.enabled &&
            settings.development.serverSimulation &&
            settings.development.serverSimulation.enabled) {
            url = settings.development.serverSimulation.urls.lists + '/:targetId.json';
        }

        var ListResource = $resource(url, { targetId: '@targetId' });

        // add custom functions for list traversing
        ListResource.prototype.hasChildLists = hasChildLists;
        ListResource.prototype.getChildLists = getChildLists;
        ListResource.prototype.getParent = getParent;

        return ListResource;

        function resolveChildLists() {
            if (this.$resolved) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    listService.add(item.targetId);
                }
            }
        }

        /**
         * @name hasChildLists
         * @desc Returns true if List contains one or more child Lists
         * @returns boolean
         */
        function hasChildLists() {
            if (this.$resolved) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].info.type === ItemTypes.LIST)
                        return true;
                }
            }
            return false;
        }

        /**
         * @name getChildLists
         * @desc Returns array of child Lists that are already resolved.
         * @returns Array
         */
        function getChildLists() {
            var childLists = [];
            if (this.$resolved) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.info.type === ItemTypes.LIST
                        && $rootScope.lists[item.targetId]) {
                        childLists.push($rootScope.lists[item.targetId]);
                    }
                }
            }
            return childLists;
        }

        /**
         * @name getParent
         * @desc Returns parent list or null if not found.
         *       If not found, it might be that it was not yet resolved.
         * @returns {List}
         */
        function getParent() {
            for (var targetId in $rootScope.lists) {
                var list = $rootScope.lists[targetId];
                var childLists = list.getChildLists();
                for (var i = 0; i < childLists.length; i++) {
                    if (childLists[i].id === this.id) {
                        return list;
                    }
                }
            }
            return null;
        }
    }
})();
