(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('MediaController', MediaController);

    MediaController.$inject = ['$rootScope', '$scope', '$log', 'dataService', 'statusService', 'listService', 'ItemTypes', 'ListIds'];

    function MediaController($rootScope, $scope, $log, dataService, statusService, listService, ItemTypes, ListIds) {
        var vm = this;

        vm.rootChildren = [];
        vm.lists = $rootScope.lists;
        vm.selectedMedia = undefined;
        vm.playerStatus = statusService.status;

        $rootScope.$watchCollection('lists', function(lists) {
            $log.info('$rootScope.lists changed', lists);
            if (lists['root']) {
                lists['root'].$promise.then(function(rootList) {
                    updateRootChildren();
                });
            }
        });

        function updateRootChildren() {
            var rootList = $rootScope.lists['root'];
            var rootChildren = [];
            for (var i = 0; i < rootList.items.length; i++) {
                if (rootList.items[i].info.type === ItemTypes.LIST) {
                    var targetId = rootList.items[i].targetId;
                    var rootChild = $rootScope.lists[targetId] || listService.add(targetId);
                    rootChildren.push(targetId);
                }
            }
            vm.rootChildren = rootChildren;
        }

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
    }
})();
