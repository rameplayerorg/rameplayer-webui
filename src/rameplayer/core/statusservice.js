/**
 * Rameplayer-WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * Status Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('statusService', statusService);

    statusService.$inject = ['$rootScope', '$log', '$interval', 'dataService', 'settings', 'listService'];

    /**
     * @namespace StatusService
     * @desc Application wide service for player status
     * @memberof Factories
     */
    function statusService($rootScope, $log, $interval, dataService, settings, listService) {
        var status = {
            position: 0
        };
        var pollerErrorCallbacks = [];
        var itemFinders = [];
        var service = {
            states: {
                stopped:   'stopped',
                playing:   'playing',
                paused:    'paused',
                buffering: 'buffering',
                error:     'error'
            },
            status:            status,
            onPollerError:     onPollerError
        };

        startStatusPoller();

        return service;

        function onPollerError(func) {
            pollerErrorCallbacks.push(func);
        }

        function startStatusPoller() {
            return $interval(pollStatus, settings.statusPollingInterval);
        }

        function pollStatus() {
            dataService.getStatus({ lists: Object.keys($rootScope.lists) })
                .then(function(response) {
                var newStatus = response.data;
                if (newStatus.cursor && newStatus.cursor.id) {
                    // find item details from UI lists
                    var item = findItem(newStatus.cursor.id);
                    if (item) {
                        newStatus.cursor.item = item;
                        //angular.extend(newStatus.cursor, item);
                        $log.info(newStatus);
                    }
                }
                // notify only when status changes
                if (!angular.equals(newStatus, status)) {
                    angular.copy(newStatus, status);
                    syncLists();
                }
            }, function(errorResponse) {
                angular.forEach(pollerErrorCallbacks, function(callback) {
                    callback(errorResponse);
                });
            });
        }

        function syncLists() {
            var i;
            var oldIds = Object.keys($rootScope.lists);
            var newIds = Object.keys(status.listsRefreshed);
            for (i = 0; i < newIds.length; i++) {
                var targetId = newIds[i];
                if (oldIds.indexOf(targetId) == -1) {
                    // new list
                    listService.add(targetId);
                }
                else if (status.listsRefreshed[targetId] !== $rootScope.lists[targetId].info.refreshed) {
                    // refresh
                    listService.refresh(targetId);
                }
            }
            // remove lists from $rootScope
            for (i = 0; i < oldIds.length; i++) {
                if (newIds.indexOf(oldIds[i]) == -1) {
                    listService.remove(oldIds[i]);
                }
            }
        }

        function findItem(id) {
            $log.info('FIND ITEM', id);
            for (var targetId in $rootScope.lists) {
                for (var i = 0; i < $rootScope.lists[targetId].items.length; i++) {
                    if (id === $rootScope.lists[targetId].items[i].id) {
                        $log.info('FOUND');
                        return $rootScope.lists[targetId].items[i];
                    }
                }
            }
            // not found
            $log.info('NOT FOUND');
            return null;
        }
    }
})();
