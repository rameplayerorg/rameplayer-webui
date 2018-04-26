(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .filter('rameTimeLeft', rameTimeLeft);

    // Converts time left to human readable format.
    function rameTimeLeft() {
        return filter;

        function filter(mins) {
            if (!mins) {
                return 'unknown';
            }

            if (mins < 1) {
                return '< 1 min';
            }

            var txt = '';
            var hours = Math.floor(mins / 60);
            if (hours > 0) {
                txt += hours + ' h ';
            }
            mins = Math.floor(mins % 60);
            txt += mins + ' min';
            return txt;
        }
    }
})();
