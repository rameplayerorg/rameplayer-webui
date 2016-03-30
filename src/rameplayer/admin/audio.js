(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('AudioController', AudioController);

    AudioController.$inject = ['logger', 'dataService'];

    function AudioController(logger, dataService) {
        var vm = this;

        vm.systemSettings = dataService.getSystemSettings();
        vm.systemSettings.$promise.then(function() {
            vm.audioPort = vm.systemSettings.audioPort; 
        });

        getAudio();

        function getAudio() {
            dataService.getAudio().then(function(response) {
                vm.channels = response.data.channels;
            });
        }
    }
})();
