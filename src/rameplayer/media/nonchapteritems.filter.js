(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .filter('rameNonChapterItems', rameNonChapterItems);

    // Filters out chapter items.
    function rameNonChapterItems() {
        return filter;

        function filter(input) {
            input = input || [];
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].type !== 'chapter') {
                    out.push(input[i]);
                }
            }
            return out;
        }
    }
})();
