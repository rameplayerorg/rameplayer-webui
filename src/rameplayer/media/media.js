(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('MediaController', MediaController);

    MediaController.$inject = ['$scope', '$log', 'dataService', 'statusService'];

    function MediaController($scope, $log, dataService, statusService) {
        var vm = this;

        vm.lists = [];
        vm.selectedMedia = undefined;
        vm.selectMedia = selectMedia;
        vm.playerStatus = statusService.status;
        vm.addToDefault = addToDefault;
        statusService.provideFinder(findItem);

        vm.interval = 0;
        vm.noWrap = true;
        vm.firstSlideActive = true;
        vm.secondSlideActive = false;

        vm.breadcrumbs = [
            'USB'
        ];
        vm.brSelect = function(index) {
            if (index === 0 && vm.secondSlideActive) {
                vm.secondSlideActive = false;
                vm.firstSlideActive = true;
                vm.breadcrumbs = [ 'USB '];
            }
        };
        vm.previ = function() {
            vm.secondSlideActive = false;
            vm.firstSlideActive = true;
            vm.breadcrumbs.slice(1, 1);
        };
        vm.subi = function() {
            vm.firstSlideActive = false;
            vm.secondSlideActive = true;
            vm.breadcrumbs.push('Subfolder');
        };

        $scope.$watchCollection('vm.playerStatus', function(current, original) {
            // update vm.lists if newer versions available
            if (!original || !original.lists || current.lists.modified > original.lists.modified) {
                loadLists();
            }
        });

        function loadLists() {
            return getMedias().then(function() {
                $log.info('Lists loaded', vm.lists);
            });
        }

        function getMedias() {
            return dataService.getLists().then(function(data) {
                vm.lists = data.data;
                return vm.lists;
            });
        }

        function selectMedia(mediaItem) {
            dataService.setCursor(mediaItem.id);
        }

        function addToDefault(item) {
            dataService.addToDefaultPlaylist(item);
        }

        function findItem(id) {
            for (var i = 0; i < vm.lists.length; i++) {
                for (var j = 0; j < vm.lists[i].items.length; j++) {
                    if (id === vm.lists[i].items[j].id) {
                        return {
                            parents: [ vm.lists[i] ],
                            item: vm.lists[i].items[j]
                        };
                    }
                }
            }
            // not found
            return null;
        }
    }
})();
