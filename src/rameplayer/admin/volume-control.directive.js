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
            bindToController: true,
            link: link
        };
        return directive;

        function link(scope, element, attrs, vm) {
            vm.element = element;
        }
    }

    VolumeControlController.$inject = ['logger', 'dataService'];

    function VolumeControlController(logger, dataService) {
        var vm = this;
        vm.isOpen = false;
        vm.toggle = toggle;
        vm.setVolume = setVolume;

        function toggle() {
            if (vm.isOpen) {
                closeControl();
            }
            else {
                openControl();
            }
            vm.element.find('.horizontal-collapse').toggleClass('open');
        }

        function openControl() {
            vm.isOpen = true;
        }

        function closeControl() {
            vm.isOpen = false;
        }

        function setVolume() {
            dataService.setVolume(vm.channel.id, vm.channel.volume);
        }
    }
})();
