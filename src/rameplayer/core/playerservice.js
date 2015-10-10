/**
 * Rameplayer-WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * Player Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('playerService', playerService);

    playerService.$inject = ['$log', '$timeout', 'dataService', 'settings'];

    /**
     * @namespace PlayerService
     * @desc Application wide service for communicating with
     *       PlayerController
     * @memberof Factories
     */
    function playerService($log, $timeout, dataService, settings) {
        var playerStatus = {};
        var statusChangedCallbacks = [];
        var mediaSelectedCallbacks = [];
        var service = {
            states: {
                stopped: 'stopped',
                playing: 'playing',
                paused:  'paused',
                error:   'error'
            },
            getStatus:       getStatus,
            onStatusChanged: onStatusChanged,
            onMediaSelected: onMediaSelected,
            selectMedia:     selectMedia,
            changeStatus:    changeStatus
        };

        pollStatus();
        return service;

        function getStatus() {
            return playerStatus;
        }

        function onStatusChanged(func) {
            statusChangedCallbacks.push(func);
        }

        function onMediaSelected(func) {
            mediaSelectedCallbacks.push(func);
        }

        /**
         * @name selectMedia
         * @desc Call this when a media item is selected.
         *       Fires registered callbacks.
         * @param {Media} media Selected media item
         * @memberof Factories.PlayerService
         */
        function selectMedia(media) {
            for (var i = 0; i < mediaSelectedCallbacks.length; i++) {
                mediaSelectedCallbacks[i](media);
            }
        }

        function changeStatus(newState, media) {
            playerStatus.state = newState;
            playerStatus.media = media ? media : null;
            notifyChangedStatus();
        }

        function notifyChangedStatus() {
            for (var i = 0; i < statusChangedCallbacks.length; i++) {
                statusChangedCallbacks[i](playerStatus);
            }
        }

        function pollStatus() {
            if (settings.development.enabled && settings.development.simulateStatus) {
                return simulatePollStatus();
            }

            dataService.getPlayerStatus().then(function(response) {
                var newStatus = response.data;
                // notify only when status changes
                if (!angular.equals(newStatus, playerStatus)) {
                    playerStatus = newStatus;
                    notifyChangedStatus();
                }
                $timeout(pollStatus, settings.statusPollingInterval);
            }, function(errorResponse) {
                $log.error('Status polling failed', errorResponse);
            });
        }

        /**
         * @name simulatePollStatus
         * @desc For development purposes only.
         *       Primitive status polling simulation.
         * @memberof Factories.PlayerService
         */
        function simulatePollStatus() {
            playerStatus.state = service.states.stopped;
            playerStatus.position = 0;

            onStatusChanged(function(newStatus) {
                if (newStatus.state === service.states.stopped) {
                    playerStatus.position = 0;
                }
            });

            poller();

            function poller() {
                if (playerStatus.state === service.states.playing) {
                    playerStatus.position += 1.0;
                    if (playerStatus.position >= playerStatus.media.duration) {
                        $log.info('Simulating end of media: stop');
                        playerStatus.state = service.states.stopped;
                        playerStatus.media = undefined;
                    }
                }
                notifyChangedStatus();

                $timeout(poller, settings.statusPollingInterval);
            }
        }
    }
})();
