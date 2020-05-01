/*jshint bitwise: false*/
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .filter('rameHHmmss', rameHHmmss);

    // Converts seconds from midnight to human readable time of a day.
    function rameHHmmss() {
        return filter;

        function filter(time) {
            var res = '00:00:00';
        	
            if (!time) {
                return res;
            }
            
            // slice to pad with front zeros, |0 to keep it integer
            res = ('0' + ((time / (60 * 60)) | 0)).slice(-2) + ':' +
                ('0' + (((time / 60) | 0) % 60)).slice(-2);
            if (time % 60 !== 0) {
                res = res + ':' + ('0' + time % 60).slice(-2);
            }

            return res;
        }
    }
})();
