(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .directive('rameVolumeControl', rameVolumeControl);

    function rameVolumeControl() {
        var directive = {
            restrict: 'E', // only element
            scope: {
                channel: '='
            },
            templateUrl: 'rameplayer/admin/volume-control.html',
            controller: VolumeControlController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    VolumeControlController.$inject = ['logger', 'dataService'];

    function VolumeControlController(logger, dataService) {
        var vm = this;
        vm.volume = 0;
        vm.isOpen = false;
        vm.toggle = toggle;

        function toggle() {
            if (vm.isOpen) {
                closeControl();
            }
            else {
                openControl();
            }
            $('#vol-form-' + vm.channel).toggleClass('open');
        }

        function openControl() {
            vm.isOpen = true;
        }

        function closeControl() {
            vm.isOpen = false;
        }

        logger.debug('VOLUME CHANNEL', vm.channel);
    }
})();
