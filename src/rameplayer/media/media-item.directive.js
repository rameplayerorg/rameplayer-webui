(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaItem', rameMediaItem);

    rameMediaItem.$inject = ['$animate', 'statusService'];

    function rameMediaItem($animate, statusService) {
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
            // disable animations, seems that there is a bug in ngAnimate,
            // which causes that CSS classes are not removed correctly
            // sometimes
            $animate.enabled(element, false);
            scope.isDropdownOpen = true;
            scope.isRemovable = (attrs.remove !== undefined);
            scope.canAddToDefault = (attrs.addToDefault !== undefined);
            scope.isMovable = (attrs.moveTo !== undefined);
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
