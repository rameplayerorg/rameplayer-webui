(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaItem', rameMediaItem);

    rameMediaItem.$inject = ['$animate', '$log', 'statusService'];

    function rameMediaItem($animate, $log, statusService) {
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
            templateUrl: 'rameplayer/media/media-item.html',
            controller: ItemController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        function link(scope, element, attrs, vm) {
            // disable animations, seems that there is a bug in ngAnimate,
            // which causes that CSS classes are not removed correctly
            // sometimes
            $animate.enabled(element, false);
            vm.isRemovable = (attrs.remove !== undefined);
            vm.canAddToDefault = (attrs.addToDefault !== undefined);
            vm.isMovable = (attrs.moveTo !== undefined);
            vm.playerStatus = statusService.status;
            vm.itemClick = itemClick;

            function itemClick($event) {
                if (vm.media.info.type === 'directory') {
                    vm.onOpenList();
                }
                else {
                    vm.onClick();
                }
            }
        }
    }

    function ItemController() {
        var vm = this;
        vm.isDropdownOpen = false;
    }

})();
