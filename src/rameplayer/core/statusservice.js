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

    statusService.$inject = ['$rootScope', '$log', '$interval', '$q', '$translate',
        'dataService', 'listService', 'toastr', 'serverConfig', '$pageVisibility'];

    /**
     * @namespace StatusService
     * @desc Application wide service for player status
     * @memberof Factories
     */
    function statusService($rootScope, $log, $interval, $q, $translate,
                           dataService, listService, toastr, serverConfig, $pageVisibility) {
        var statusInterval = serverConfig.statusInterval || 1000;
        var status = {
            position: 0
        };
        var itemFinders = [];
        var error = {
            message: null
        };
        var service = {
            states: {
                stopped:   'stopped',
                playing:   'playing',
                paused:    'paused',
                buffering: 'buffering',
                offline:   'offline',
                error:     'error'
            },
            status: status,
            error: error
        };

        var displayedNotifications = {
            restartRequired: false,
            updateAvailable: false
        };

        var pollerHandler = startStatusPoller();
        $pageVisibility.$on('pageFocused', pageFocused);
        $pageVisibility.$on('pageBlurred', pageBlurred);

        return service;

        function startStatusPoller() {
            return $interval(pollStatus, statusInterval);
        }

        function stopStatusPoller() {
            if (pollerHandler) {
                $interval.cancel(pollerHandler);
                pollerHandler = null;
            }
        }

        function pollStatus() {
            dataService.getStatus({
                lists: Object.keys($rootScope.lists)
            })
            .then(function(response) {
                var newStatus = response.data;
                // notify only when status changes
                if (!angular.equals(newStatus, status)) {
                    angular.copy(newStatus, status);
                    syncLists();
                    checkServerNotifications();
                }
                error.message = null;
            }, function(errorResponse) {
                $log.error('Status query failed', errorResponse);
                error.message = errorResponse.status + ' ' + errorResponse.statusText;
                if (errorResponse.status === -1) {
                    // network error
                    status.state = service.states.offline;
                }
            });
        }

        function syncLists() {
            var oldIds = Object.keys($rootScope.lists);
            var newIds = Object.keys(status.listsRefreshed);
            var promises = [];
            for (var i = 0; i < newIds.length; i++) {
                var listId = newIds[i];
                var list;
                if (oldIds.indexOf(listId) === -1) {
                    // new list
                    list = listService.add(listId);
                    promises.push(list.$promise);
                }
                else if ($rootScope.lists[listId].refreshed &&
                         status.listsRefreshed[listId] !== $rootScope.lists[listId].refreshed) {
                    // refresh
                    list = listService.refresh(listId);
                    promises.push(list.$promise);
                }
            }

            // remove lists from $rootScope only after all lists are
            // updated so no old items are referring to them
            $q.all(promises).then(function() {
                for (var i = 0; i < oldIds.length; i++) {
                    if (newIds.indexOf(oldIds[i]) === -1) {
                        listService.remove(oldIds[i]);
                    }
                }
            });
        }

        function checkServerNotifications() {
            // restart required notification
            if (status.player &&
                status.player.rebootRequired &&
                !displayedNotifications.restartRequired) {
                $translate(['RESTART_REQUIRED', 'RESTART_REQUIRED_DESC']).then(function(translations) {
                    toastr.warning(translations.RESTART_REQUIRED_DESC,
                                   translations.RESTART_REQUIRED, {
                                       timeOut: 0,
                                       extendedTimeOut: 0,
                                       tapToDismiss: false,
                                       closeButton: true
                                   });
                    displayedNotifications.restartRequired = true;
                });
            }

            // update available notification
            if (status.player &&
                status.player.updateAvailable &&
                !displayedNotifications.updateAvailable) {
                $translate(['UPDATE_AVAILABLE', 'UPDATE_AVAILABLE_DESC']).then(function(translations) {
                    toastr.info(translations.UPDATE_AVAILABLE_DESC,
                                translations.UPDATE_AVAILABLE, {
                                    timeOut: 30000,
                                    closeButton: true
                                });
                    displayedNotifications.updateAvailable = true;
                });
            }
        }

        function pageFocused() {
            if (!pollerHandler) {
                $log.debug('page visible, start status polling');
                pollerHandler = startStatusPoller();
            }
        }

        function pageBlurred() {
            if (pollerHandler) {
                $log.debug('page not visible, stop status polling');
                stopStatusPoller();
            }
        }
    }
})();
