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

    statusService.$inject = ['$log', '$interval', 'dataService', 'settings'];

    /**
     * @namespace StatusService
     * @desc Application wide service for player status
     * @memberof Factories
     */
    function statusService($log, $interval, dataService, settings) {
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
            onPollerError:     onPollerError,
            provideFinder:     provideFinder,
            findItem:          findItem
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
            dataService.getStatus().then(function(response) {
                var newStatus = response.data;
                if (newStatus.cursor && newStatus.cursor.id) {
                    // find item details from UI lists
                    var item = findItem(newStatus.cursor.id);
                    if (item) {
                        newStatus.cursor.item = item;
                    }
                }
                // notify only when status changes
                if (!angular.equals(newStatus, status)) {
                    angular.copy(newStatus, status);
                }
            }, function(errorResponse) {
                angular.forEach(pollerErrorCallbacks, function(callback) {
                    callback(errorResponse);
                });
            });
        }

        function provideFinder(func) {
            itemFinders.push(func);
        }

        function findItem(id) {
            for (var i = 0; i < itemFinders.length; i++) {
                var item = itemFinders[i](id);
                if (item) {
                    return item;
                }
            }
            // not found
            return null;
        }
    }
})();
