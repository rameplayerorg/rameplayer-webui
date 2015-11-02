(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaItem', rameMediaItem);

    function rameMediaItem() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'E',
            scope: {
                'media': '=', // take media from attribute
                'remove': '&'
            },
            templateUrl: 'rameplayer/media/media-item.html'
        };
        return directive;

        //function link(scope, element, attrs) {
        //}
    }
})();
