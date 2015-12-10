(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaItem', rameMediaItem);

    rameMediaItem.$inject = ['statusService'];

    function rameMediaItem(statusService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'media': '=', // take media from attribute
                'onClick': '&',
                'onOpenList': '&',
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
            scope.playerStatus = statusService.status;
            scope.itemClick = itemClick;

            function itemClick() {
                if (scope.media.info.type === 'directory') {
                    scope.onOpenList();
                }
                else {
                    scope.onClick();
                }
            }
        }
    }
})();
