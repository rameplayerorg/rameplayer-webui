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
        .factory('listProvider', listProvider);

    listProvider.$inject = ['$log', '$resource', '$rootScope', 'ItemTypes'];

    /**
     * @namespace List
     * @desc Resource for List
     * @memberof Factories
     */
    function listProvider($log, $resource, $rootScope, ItemTypes) {

        var service = {
            getResource: getResource
        };
        return service;

        function getResource(url) {
            //var url = baseUrl + 'lists/:targetId';
            var ListResource = $resource(url, {
                targetId: '@targetId'
            });

            // add custom functions for list traversing
            ListResource.prototype.hasChildLists = hasChildLists;
            ListResource.prototype.getChildLists = getChildLists;
            ListResource.prototype.getParent = getParent;

            return ListResource;
        }

        /**
         * @name hasChildLists
         * @desc Returns true if List contains one or more child Lists
         * @returns boolean
         */
        function hasChildLists() {
            if (this.$resolved === true) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].info.type === ItemTypes.LIST) {
                        return true;
                    }
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
            if (this.$resolved === true) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.info.type === ItemTypes.LIST && 
                        $rootScope.lists[item.targetId]) {
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
