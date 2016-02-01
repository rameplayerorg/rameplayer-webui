(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .directive('rameMediaList', rameMediaList);

    rameMediaList.$inject = ['$rootScope', 'statusService', 'dataService', 'listService', 'ListIds'];

    function rameMediaList($rootScope, statusService, dataService, listService, ListIds) {
        // Usage:
        //
        // Creates:
        //

        var slides = [];

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'listId': '='
            },
            templateUrl: 'rameplayer/media/media-list.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.lists = $rootScope.lists;
            scope.slides = [
                {
                    active: true,
                    listId: scope.listId
                }
            ];

            // Add empty placeholder slides, it's faster when
            // they are ready. More slides will be created in
            // addSlide() if necessary.
            addEmptySlides(4);

            scope.breadcrumbs = [];
            $rootScope.lists[scope.listId].$promise.then(function(list) {
                scope.breadCrumbsEnabled = $rootScope.lists[scope.listId].hasChildLists();
                scope.breadcrumbs.push(scope.listId);
            });

            scope.selectMedia = selectMedia;
            scope.addToDefault = addToDefault;

            scope.openList = openList;
            scope.activateSlide = activateSlide;

            function selectMedia(item) {
                dataService.setCursor(item.id);
            }

            function addToDefault(item) {
                dataService.addToPlaylist(ListIds.DEFAULT_PLAYLIST, item);
            }

            function addSlide(listId) {
                var index = 0;
                for (var i = 0; i < scope.slides.length; i++) {
                    if (scope.slides[i].active) {
                        index = i + 1;
                        break;
                    }
                }
                scope.slides[index].active = true;
                scope.slides[index].listId = listId;

                // add more placeholders
                if (index + 1 === scope.slides.length) {
                    addEmptySlides(3);
                }
            }

            function addEmptySlides(amount) {
                for (var i = 0; i < amount; i++) {
                    scope.slides.push({
                        active: false,
                        listId: null
                    });
                }
            }

            function openList(item) {
                var list = $rootScope[item.id] || listService.add(item.id);
                addSlide(item.id);
                scope.breadcrumbs.push(item.id);
            }

            function activateSlide(index) {
                scope.slides[index].active = true;
                scope.breadcrumbs = scope.breadcrumbs.slice(0, index + 1);
            }
        }
    }
})();
