
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

            // Returns true if List contains one or more child Lists
            ListResource.prototype.hasChildLists = function() {
                if (this.$resolved === true) {
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].info.type === ItemTypes.LIST) {
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
                        if (item.info.type === ItemTypes.LIST &&
                            $rootScope.lists[item.targetId]) {
                            childLists.push($rootScope.lists[item.targetId]);
                        }
                    }
                }
                return childLists;
            };

            ListResource.prototype.getParent = function() {
                var targetIds = Object.keys($rootScope.lists);
                for (var j = 0; j < targetIds.length; j++) {
                    var targetId = targetIds[j];
                    var list = $rootScope.lists[targetId];
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
