/**
 * Rameplayer-WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * PlayerFilter
 * @namespace Filters
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .filter('playerTime', playerTime);

    playerTime.$inject = ['$log'];

    /**
     * @namespace PlayerTime
     * @desc Filter for showing times in player.
     * @memberOf Filters
     */
    function playerTime($log) {
        return playerTimeFilter;

        ////////////////

        /**
         * @name playerTimeFilter
         * @desc Shows seconds in 'h:mm:ss' format
         * @param {float} seconds Time in seconds
         * @param {float} measure If given, used to determine the
         *                length of format
         * @returns {String}
         * @memberOf Filters.PlayerTime
         */
        function playerTimeFilter(seconds, measure) {
            measure = measure ? measure : seconds;
            seconds = Math.floor(seconds);
            if (measure >= 3600) {
                return digits(seconds, 3600) + ':' +
                    digits(seconds % 3600, 60, true) + ':' +
                    digits(seconds % 60, 1, true);
            }
            else {
                return digits(seconds % 3600, 60) + ':' +
                    digits(seconds % 60, 1, true);
            }
            return str;
        }

        function digits(value, divider, twoDigit) {
            value = Math.floor(value / divider);
            if (twoDigit && value < 10) {
                value = '0' + value;
            }
            return '' + value;
        }
    }

})();
