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

    playerService.$inject = ['$log', '$interval', 'dataService', 'settings'];

    /**
     * @namespace PlayerService
     * @desc Application wide service for communicating with
     *       PlayerController
     * @memberof Factories
     */
    function playerService($log, $interval, dataService, settings) {
        var playerStatus = {};
        var statusChangedCallbacks = [];
        var mediaSelectedCallbacks = [];
        var pollerErrorCallbacks = [];
        var addToPlaylistCallbacks = [];
        var service = {
            states: {
                stopped: 'stopped',
                playing: 'playing',
                paused:  'paused',
                error:   'error'
            },
            getStatus:         getStatus,
            onStatusChanged:   onStatusChanged,
            onMediaSelected:   onMediaSelected,
            onPollerError:     onPollerError,
            onAddToPlaylist:   onAddToPlaylist,
            selectMedia:       selectMedia,
            changeStatus:      changeStatus,
            addToPlaylist:     addToPlaylist
        };
        var pollerPromise;

        startStatusPoller();
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

        function onPollerError(func) {
            pollerErrorCallbacks.push(func);
        }

        function onAddToPlaylist(func) {
            addToPlaylistCallbacks.push(func);
        }

        /**
         * @name selectMedia
         * @desc Call this when a media item is selected.
         *       Fires registered callbacks.
         * @param {Media} media Selected media item
         * @memberof Factories.PlayerService
         */
        function selectMedia(media) {
            angular.forEach(mediaSelectedCallbacks, function(callback) {
                callback(media);
            });
        }

        function changeStatus(newState, media) {
            playerStatus.state = newState;
            playerStatus.media = media ? media : null;
            notifyChangedStatus();
        }

        function addToPlaylist(media) {
            angular.forEach(addToPlaylistCallbacks, function(callback) {
                callback(media);
            });
        }

        function notifyChangedStatus() {
            angular.forEach(statusChangedCallbacks, function(callback) {
                callback(playerStatus);
            });
        }

        function startStatusPoller() {
            if (settings.development.enabled && settings.development.simulateStatus) {
                return simulatePollStatus();
            }
            else {
                return $interval(pollStatus, settings.statusPollingInterval);
            }
        }

        function pollStatus() {
            dataService.getPlayerStatus().then(function(response) {
                var newStatus = response.data;
                // notify only when status changes
                if (!angular.equals(newStatus, playerStatus)) {
                    playerStatus = newStatus;
                    notifyChangedStatus();
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
            playerStatus.state = service.states.stopped;
            playerStatus.position = 0;

            onStatusChanged(function(newStatus) {
                if (newStatus.state === service.states.stopped) {
                    playerStatus.position = 0;
                }
            });

            return $interval(poller, settings.statusPollingInterval);

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
            }
        }
    }
})();
