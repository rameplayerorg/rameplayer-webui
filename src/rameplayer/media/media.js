(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('MediaController', MediaController);

    MediaController.$inject = ['$log', 'dataService', 'playerService'];

    function MediaController($log, dataService, playerService) {
        var vm = this;
        vm.lists = [];

        vm.selectedMedia = undefined;
        vm.selectMedia = function(mediaItem) {
            vm.selectedMedia = mediaItem;

            // tell PlayerController through PlayerService that
            // media item was selected
            playerService.selectMedia(mediaItem);
        };

        loadLists();

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
