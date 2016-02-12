(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('SyncModalController', SyncModalController);

    SyncModalController.$inject = ['$scope', '$log', '$uibModalInstance', 'ListIds', 'ItemTypes', 'clusterService'];

    function SyncModalController($scope, $log, $uibModalInstance, ListIds, ItemTypes, clusterService) {
        var vm = this;

        vm.units = clusterService.units;
        vm.unit = vm.units[0].id;

        vm.unitPlaylists = [];
        vm.unitPlaylist = null;

        vm.open = open;
        vm.cancel = cancel;

        $scope.$watch('vm.unit', function() {
            refreshPlaylists();
        });

        /**
         * @name refreshPlaylists
         * @desc Refreshes Playlist dropdown field by cluster unit data
         */
        function refreshPlaylists() {
            vm.unitPlaylists = [];
            vm.unitPlaylist = null;
            var dataService = clusterService.getDataService(vm.unit);
            if (dataService) {
                var root = dataService.getList(ListIds.ROOT);
                root.$promise.then(function(rootList) {
                    for (var i = 0; i < rootList.items.length; i++) {
                        var list = rootList.items[i];
                        if (list.type === ItemTypes.PLAYLIST) {
                            vm.unitPlaylists.push(list);
                        }
                    }
                    // pre-select the first option
                    if (vm.unitPlaylists.length > 0) {
                        vm.unitPlaylist = vm.unitPlaylists[0].id;
                    }
                });
            }
        }

        function open() {
            $uibModalInstance.close({
                unit: clusterService.getUnit(vm.unit),
                playlist: vm.unitPlaylist
            });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
