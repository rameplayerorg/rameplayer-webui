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
            link: link,
            restrict: 'E',
            scope: {
                'media': '=', // take media from attribute
                'cursor': '=',
                'onClick': '&',
                'remove': '&',
                'addToDefault': '&',
                'moveTo': '&'
            },
            templateUrl: 'rameplayer/media/media-item.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.isDropdownOpen = false;
            scope.isRemovable = (attrs.remove !== undefined);
            scope.canAddToDefault = (attrs.addToDefault !== undefined);
            scope.isMovable = (attrs.moveTo !== undefined);
            scope.toggleDropdown = function($event) {
                scope.isDropdownOpen = !scope.isDropdownOpen;
            };
        }
    }
})();
