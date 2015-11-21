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
    }
})();
