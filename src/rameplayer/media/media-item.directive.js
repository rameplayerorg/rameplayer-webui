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
            //link: link,
            restrict: 'E',
            //scope: {
            //},
            templateUrl: 'rameplayer/media/media-item.html'
        };
        return directive;

        //function link(scope, element, attrs) {
        //}
    }
})();
