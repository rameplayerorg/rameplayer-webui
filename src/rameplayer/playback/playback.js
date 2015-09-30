(function() {
    'use strict';

    angular
        .module('rameplayer.playback')
        .controller('PlaybackController', ['$http', '$log', '$q', PlaybackController]);

    function PlaybackController($http, $log, $q) {
        var vm = this;

        vm.playPause = 'glyphicon-play';
        vm.playPauseClasses = 'btn-primary';

        vm.togglePlay = function() {
            if (vm.playPause === 'glyphicon-pause') {
                vm.playPause = 'glyphicon-play';
                vm.playPauseClasses = 'btn-primary';
            }
            else {
                vm.playPause = 'glyphicon-pause';
                vm.playPauseClasses = 'btn-warning';
            }
        };
   }
})();
