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

    statusService.$inject = ['$rootScope', '$log', '$interval', '$q', '$translate', 'dataService', 'listService', 'toastr'];

    /**
     * @namespace StatusService
     * @desc Application wide service for player status
     * @memberof Factories
     */
    function statusService($rootScope, $log, $interval, $q, $translate, dataService, listService, toastr) {
        var statusInterval = rameServerConfig.statusInterval || 1000;
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
        var restartWarningDisplayed = false;

        startStatusPoller();

        return service;

        function onPollerError(func) {
            pollerErrorCallbacks.push(func);
        }

        function startStatusPoller() {
            return $interval(pollStatus, statusInterval);
        }

        function pollStatus() {
            dataService.getStatus({ lists: Object.keys($rootScope.lists) })
                .then(function(response) {
                var newStatus = response.data;
                // notify only when status changes
                if (!angular.equals(newStatus, status)) {
                    angular.copy(newStatus, status);
                    syncLists();

                    // notify about restart required
                    if (newStatus.player &&
                        newStatus.player.rebootRequired &&
                        !restartWarningDisplayed) {
                        $translate(['RESTART_REQUIRED', 'RESTART_REQUIRED_HELP']).then(function(translations) {
                            toastr.warning(translations.RESTART_REQUIRED_HELP,
                                           translations.RESTART_REQUIRED, {
                                               timeOut: 0,
                                               extendedTimeOut: 0,
                                               tapToDismiss: false,
                                               closeButton: true
                                           });
                            restartWarningDisplayed = true;
                        });
                    }
                }
            }, function(errorResponse) {
                angular.forEach(pollerErrorCallbacks, function(callback) {
                    callback(errorResponse);
                });
            });
        }

        function syncLists() {
            var oldIds = Object.keys($rootScope.lists);
            var newIds = Object.keys(status.listsRefreshed);
            var promises = [];
            for (var i = 0; i < newIds.length; i++) {
                var targetId = newIds[i];
                if (oldIds.indexOf(targetId) == -1) {
                    // new list
                    var list = listService.add(targetId);
                    promises.push(list.$promise);
                }
                else if ($rootScope.lists[targetId].info && status.listsRefreshed[targetId] !== $rootScope.lists[targetId].info.refreshed) {
                    // refresh
                    var list = listService.refresh(targetId);
                    promises.push(list.$promise);
                }
            }

            // remove lists from $rootScope only after all lists are
            // updated so no old items are referring to them
            $q.all(promises).then(function() {
                for (var i = 0; i < oldIds.length; i++) {
                    if (newIds.indexOf(oldIds[i]) == -1) {
                        listService.remove(oldIds[i]);
                    }
                }
            });
        }
    }
})();
