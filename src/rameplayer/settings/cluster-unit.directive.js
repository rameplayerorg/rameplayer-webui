(function() {
    'use strict';

    angular
        .module('rameplayer.settings')
        .directive('rameClusterUnit', rameClusterUnit);

    rameClusterUnit.$inject = ['$log', 'clusterService'];

    function rameClusterUnit($log, clusterService) {
        var directive = {
            restrict: 'E', // only element
            scope: {
                unit: '='
            },
            templateUrl: 'rameplayer/settings/cluster-unit.html',
            controller: ClusterUnitController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    ClusterUnitController.$inject = ['$log', 'clusterService', 'toastr'];

    function ClusterUnitController($log, clusterService, toastr) {
        var vm = this;
        vm.editMode = false;
        vm.editUnit = {
            ip: {
                value: vm.unit.address,
                valid: true,
            },
            port: vm.unit.port,
            delay: vm.unit.delay
        };

        vm.colors = [
            {rgb: 106, hex: '#A0522D', name: 'sienna'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 87,  hex: '#FF4500', name: 'orangered'},
            {rgb: 17,  hex: '#008B8B', name: 'darkcyan'},
            {rgb: 18,  hex: '#B8860B', name: 'darkgoldenrod'},
            {rgb: 68,  hex: '#32CD32', name: 'limegreen'},
            {rgb: 42,  hex: '#FFD700', name: 'gold'},
            {rgb: 77,  hex: '#48D1CC', name: 'mediumturquoise'},
            {rgb: 107, hex: '#87CEEB', name: 'skyblue'},
            {rgb: 46,  hex: '#FF69B4', name: 'hotpink'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 64,  hex: '#87CEFA', name: 'cornflowerblue'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 64,  hex: '#87CEFA', name: 'lightskyblue'},
            {rgb: 13,  hex: '#6495ED', name: 'cornflowerblue'},
            {rgb: 15,  hex: '#DC143C', name: 'crimson'},
            {rgb: 24,  hex: '#FF8C00', name: 'darkorange'},
            {rgb: 78,  hex: '#C71585', name: 'mediumvioletred'},
            {rgb: 123, hex: '#000000', name: 'black'}
        ];

        vm.colorSelected = vm.colors[0].hex;
        vm.openEdit = openEdit;
        vm.cancelEdit = cancelEdit;
        vm.save = save;
        vm.remove = remove;

        function openEdit() {
            vm.editMode = true;
        }

        function cancelEdit() {
            vm.editMode = false;
        }

        function save() {
            if (vm.editUnit.ip.valid) {
                vm.unit.address = vm.editUnit.ip.value;
                vm.unit.port = vm.editUnit.port;
                vm.unit.delay = vm.editUnit.delay;
                vm.editMode = false;
                toastr.success('Unit settings updated.', 'Cluster');
            }
            else {
                toastr.error('IP address is invalid.', 'Cluster Unit Settings');
            }
        }

        function remove() {
            clusterService.removeUnit(vm.unit.id);
            toastr.success('Unit removed.', 'Cluster');
        }
    }
})();
