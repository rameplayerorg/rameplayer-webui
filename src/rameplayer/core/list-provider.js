
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
            var ListResource = $resource(url, {
                id: '@id'
            });

            // add custom functions for list traversing

            // Returns true if List contains one or more child Lists
            ListResource.prototype.hasChildLists = function() {
                if (this.$resolved === true) {
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].type === ItemTypes.DIRECTORY) {
                            return true;
                        }
                    }
                }
                return false;
            };

            ListResource.prototype.getChildLists = function() {
                var childLists = [];
                if (this.$resolved === true) {
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        if (item.type === ItemTypes.DIRECTORY &&
                            $rootScope.lists[item.id]) {
                            childLists.push($rootScope.lists[item.id]);
                        }
                    }
                }
                return childLists;
            };

            ListResource.prototype.getParent = function() {
                var ids = Object.keys($rootScope.lists);
                for (var j = 0; j < ids.length; j++) {
                    var id = ids[j];
                    var list = $rootScope.lists[id];
                    var childLists = list.getChildLists();
                    for (var i = 0; i < childLists.length; i++) {
                        if (childLists[i].id === this.id) {
                            return list;
                        }
                    }
                }
                return null;
            };

            return ListResource;
        }
    }
})();
