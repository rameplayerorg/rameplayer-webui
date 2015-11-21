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
        var pollerPromise;

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

        /**
         * @name simulatePollStatus
         * @desc For development purposes only.
         *       Primitive status polling simulation.
         * @memberof Factories.PlayerService
         */
        function simulatePollStatus() {
            $log.info('Status simulation enabled, not using status service');
            status.state = service.states.stopped;
            status.position = 0;

            return $interval(poller, settings.statusPollingInterval);

            function poller() {
                if (status.state === service.states.playing) {
                    status.position += 1.0;
                    if (status.position >= status.media.duration) {
                        $log.info('Simulating end of media: stop');
                        status.state = service.states.stopped;
                        status.position = 0;
                        status.media = undefined;
                    }
                }
            }
        }
    }
})();
