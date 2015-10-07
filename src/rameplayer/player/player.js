(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', 'playerService', 'dataService'];

    function PlayerController($log, playerService, dataService) {
        var vm = this;

        // media when nothing has selected
        var dummyMedia = {
            title: 'None'
        };

        vm.selectedMedia = dummyMedia;
        vm.playPause = 'glyphicon-play';
        vm.playPauseClasses = 'btn-primary';

        // implement playerService.selectMedia()
        playerService.selectMedia = function(media) {
            $log.info('Selected media', media);
            vm.selectedMedia = media;
        };

        vm.togglePlay = function() {
            if (vm.playPause === 'glyphicon-pause') {
                dataService.pause().then(function(data) {
                    $log.info('Response', data);
                });
                $log.info('Paused');
                vm.playPause = 'glyphicon-play';
                vm.playPauseClasses = 'btn-primary';
            }
            else {
                $log.info('Playing started');
                dataService.play(vm.selectedMedia).then(function(data) {
                    $log.info('Response', data);
                });
                vm.playPause = 'glyphicon-pause';
                vm.playPauseClasses = 'btn-warning';
            }
       };
   }
})();
