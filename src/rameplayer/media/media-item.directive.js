(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaItem', rameMediaItem);

    rameMediaItem.$inject = ['$animate', '$log', 'statusService', 'ItemTypes'];

    function rameMediaItem($animate, $log, statusService, ItemTypes) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'media': '=', // take media from attribute
                'list': '=',
                'onClick': '&',
                'onOpenList': '&',
                'remove': '&',
                'addToDefault': '&',
                'moveTo': '&',
                'hideDate': '=',
                'syncHighlight': '=',
                'showChapters': '=',
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
                if (vm.media.type === ItemTypes.DIRECTORY) {
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
        vm.chaptersCollapsed = true;
        vm.chapters = findChapters();

        function findChapters() {
            var chapters = [];
            if (vm.list !== undefined) {
                for (var i = 0; i < vm.list.items.length; i++) {
                    if (vm.list.items[i].chapterParentId === vm.media.id) {
                        chapters.push(vm.list.items[i]);
                    }
                }
            }
            return chapters;
        }
    }

})();
