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
        var service = {
            // override this function
            selectMedia: selectMedia
        };
        return service;

        /**
         * @name selectMedia
         * @desc This is called when a media is selected.
         *       PlayerController overrides this function.
         * @param {Media} media Selected media item
         * @memberof Factories.PlayerService
         */
        function selectMedia(media) { }
    }
})();
