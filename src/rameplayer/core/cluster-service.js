/**
 * RamePlayer WebUI
 * Copyright (C) 2016
 *
 * See LICENSE.
 */

/**
 * List Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('clusterService', clusterService);

    clusterService.$inject = ['$log', 'dataService', 'uuid'];

    /**
     * @namespace ClusterService
     * @desc Application wide service for cluster handling
     * @memberof Factories
     */
    function clusterService($log, dataService, uuid) {
        // cluster units
        var units = [];

        var colors = [
            {rgb: 87,  hex: '#FF4500', name: 'orangered'},
            {rgb: 68,  hex: '#32CD32', name: 'limegreen'},
            {rgb: 42,  hex: '#FFD700', name: 'gold'},
            {rgb: 13,  hex: '#6495ED', name: 'cornflowerblue'},
            {rgb: 106, hex: '#A0522D', name: 'sienna'},
            {rgb: 78,  hex: '#C71585', name: 'mediumvioletred'},
            {rgb: 17,  hex: '#008B8B', name: 'darkcyan'},
            {rgb: 18,  hex: '#B8860B', name: 'darkgoldenrod'},
            {rgb: 15,  hex: '#DC143C', name: 'crimson'},
            {rgb: 0,   hex: '#2E8B57', name: 'seagreen'},
            {rgb: 77,  hex: '#48D1CC', name: 'mediumturquoise'},
            {rgb: 107, hex: '#87CEEB', name: 'skyblue'},
            {rgb: 46,  hex: '#FF69B4', name: 'hotpink'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 64,  hex: '#87CEFA', name: 'cornflowerblue'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 64,  hex: '#87CEFA', name: 'lightskyblue'},
            {rgb: 24,  hex: '#FF8C00', name: 'darkorange'},
            {rgb: 47,  hex: '#CD5C5C', name: 'indianred'},
            {rgb: 123, hex: '#000000', name: 'black'}
        ];

        var service = {
            units: units,
            addUnit: addUnit,
            removeUnit: removeUnit,
            getColors: getColors
        };

        return service;

        function addUnit(address, port, delay) {
            // generate color for the new unit
            var color = getNextFreeColor();
            var unit = {
                id: uuid.v4(),
                hostname: resolveHostname(address),
                address: address,
                port: port,
                delay: parseFloat(delay),
                color: color
            };
            units.push(unit);
            $log.debug('New unit added to cluster', unit);
            return unit.id;
        }

        function removeUnit(id) {
            for (var i = 0; i < units.length; i++) {
                if (units[i].id === id) {
                    units.splice(i, 1);
                    $log.debug('Unit ' + id + ' removed from cluster');
                    return true;
                }
            }
            return false;
        }

        function resolveHostname(address) {
            return 'hostname';
        }

        function getColors() {
            return colors;
        }

        function getNextFreeColor() {
            var i;
            var reserved = [];
            for (i = 0; i < units.length; i++) {
                reserved.push(units[i].color);
            }
            for (i = 0; i < colors.length; i++) {
                if (reserved.indexOf(colors[i].hex) === -1) {
                    return colors[i].hex;
                }
            }
            // no free labels left
            return null;
        }
    }
})();
