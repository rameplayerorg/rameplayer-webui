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

    /**
     * @namespace PlayerService
     * @desc Application wide service for communicating with
     *       PlayerController
     * @memberof Factories
     */
    function playerService() {
        var state;
        var stateChangedCallbacks = [];
        var mediaSelectedCallbacks = [];
        var playingMedia;
        var service = {
            states: {
                stopped: 'stopped',
                playing: 'playing',
                paused:  'paused',
                error:   'error'
            },
            onStateChanged:  onStateChanged,
            onMediaSelected: onMediaSelected,
            selectMedia:     selectMedia,
            getPlayerState:  getPlayerState,
            setPlayerState:  setPlayerState,
            getPlayingMedia: getPlayingMedia,
            setPlayingMedia: setPlayingMedia
        };
        return service;

        function onStateChanged(func) {
            stateChangedCallbacks.push(func);
        }

        function onMediaSelected(func) {
            mediaSelectedCallbacks.push(func);
        }

        /**
         * @name selectMedia
         * @desc Call this when a media item is selected.
         *       It fires registered callbacks.
         * @param {Media} media Selected media item
         * @memberof Factories.PlayerService
         */
        function selectMedia(media) {
            for (var i = 0; i < mediaSelectedCallbacks.length; i++) {
                mediaSelectedCallbacks[i](media);
            }
        }

        function getPlayerState() {
            return playerState;
        }

        function setPlayerState(newState, media) {
            state = newState;
            playingMedia = media ? media : null;
            for (var i = 0; i < stateChangedCallbacks.length; i++) {
                stateChangedCallbacks[i](state);
            }
        }

        function getPlayingMedia() {
            return playingMedia;
        }

        function setPlayingMedia(media) {
            playingMedia = media;
        }
    }
})();
