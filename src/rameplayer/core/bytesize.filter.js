(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .filter('rameByteSize', rameByteSize);

    // Converts byte sizes to human readable format.
    function rameByteSize() {
        return filter;

        function filter(kb) {
            if (!kb) {
                return '0';
            }
            var thresh = 1024;
            if (Math.abs(kb) < thresh) {
                return kb + ' KiB';
            }
            var units = ['MiB', 'GiB', 'TiB'];
            var u = -1;
            do {
                kb /= thresh;
                u++;
            } while (Math.abs(kb) >= thresh && u < units.length - 1);
            return kb.toFixed(1) + ' ' + units[u];
        }
    }
})();
