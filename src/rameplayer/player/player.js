(function() {
    'use strict';

    angular
        .module('rameplayer.player')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$log', 'dataService'];

    function PlayerController($log, dataService) {
        var vm = this;

        vm.playPause = 'glyphicon-play';
        vm.playPauseClasses = 'btn-primary';

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
                dataService.play().then(function(data) {
                    $log.info('Response', data);
                });
                vm.playPause = 'glyphicon-pause';
                vm.playPauseClasses = 'btn-warning';
            }
       };
   }
})();
