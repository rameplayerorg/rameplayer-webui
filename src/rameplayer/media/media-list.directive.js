(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaList', rameMediaList);

    rameMediaList.$inject = ['$rootScope', 'statusService', 'dataService', 'listService'];

    function rameMediaList($rootScope, statusService, dataService, listService) {
        // Usage:
        //
        // Creates:
        //

        var slides = [];

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'list': '=' // take media from attribute
            },
            templateUrl: 'rameplayer/media/media-list.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.lists = $rootScope.lists;
            scope.slides = [ { active: true, list: scope.list } ];

            // Add empty placeholder slides, it's faster when
            // they are ready. More slides will be created in
            // addSlide() if necessary.
            addEmptySlides(4);

            scope.breadcrumbs = [];
            scope.list.$promise.then(function() {
                scope.breadcrumbs.push(scope.list.info.title);
            });

            scope.selectMedia = selectMedia;
            scope.addToDefault = addToDefault;

            scope.openList = openList;
            scope.activateSlide = activateSlide;

            function selectMedia(item) {
                dataService.setCursor(item.id);
            }

            function addToDefault(item) {
                dataService.addToDefaultPlaylist(item);
            }

            function addSlide(list) {
                var index = 0;
                for (var i = 0; i < scope.slides.length; i++) {
                    if (scope.slides[i].active) {
                        index = i + 1;
                        break;
                    }
                }
                scope.slides[index].active = true;
                scope.slides[index].list = list;

                // add more placeholders
                if (index + 1 == scope.slides.length) {
                    addEmptySlides(3);
                }
            }

            function addEmptySlides(amount) {
                for (var i = 0; i < amount; i++) {
                    scope.slides.push({ active: false, list: null });
                }
            }

            function openList(item) {
                var list = $rootScope[item.targetId] || listService.add(item.targetId);
                addSlide(list);
                scope.breadcrumbs.push(item.info.title);
            }

            function activateSlide(index) {
                scope.slides[index].active = true;
                scope.breadcrumbs = scope.breadcrumbs.slice(0, index + 1);
            }
        }
    }
})();
