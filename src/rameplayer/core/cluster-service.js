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

    clusterService.$inject = ['$log', '$interval', '$localStorage', 'dataServiceProvider', 'uuid'];

    /**
     * @namespace ClusterService
     * @desc Application wide service for cluster handling
     * @memberof Factories
     */
    function clusterService($log, $interval, $localStorage, dataServiceProvider, uuid) {
        // cluster units are saved to $localStorage
        var $storage = $localStorage.$default({
            clusterUnits: []
        });

        // create dataServices for existing cluster units
        var dataServices = {};
        createDataServices();

        // status objects for cluster units, not persisted
        var statuses = {};

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
            units: $localStorage.clusterUnits,
            statuses: statuses,
            addUnit: addUnit,
            updateUnit: updateUnit,
            removeUnit: removeUnit,
            getColors: getColors
        };

        var statusInterval = 1000;
        startStatusPoller();

        return service;

        function createDataServices() {
            for (var i = 0; i < $localStorage.clusterUnits.length; i++) {
                var unit = $localStorage.clusterUnits[i];
                dataServices[unit.id] = dataServiceProvider.create(unit);
            }
        }

        function addUnit(address, port, delay) {
            // generate color for the new unit
            var color = getNextFreeColor();
            var unit = {
                id: uuid.v4(),
                host: address,
                port: port,
                delay: parseFloat(delay),
                color: color
            };
            $localStorage.clusterUnits.push(unit);

            // create dataService for new cluster unit
            var dataService = dataServiceProvider.create(unit);
            dataServices[unit.id] = dataService;

            resolveHostname(unit);

            $log.debug('New unit added to cluster', unit);
            return unit.id;
        }

        function updateUnit(unit) {
            delete dataServices[unit.id];
            // create new dataservice
            dataServices[unit.id] = dataServiceProvider.create(unit);
            delete statuses[unit.id];
            delete unit.hostname;
            resolveHostname(unit);
            $log.debug('Cluster unit updated', unit);
        }

        function removeUnit(id) {
            for (var i = 0; i < $localStorage.clusterUnits.length; i++) {
                if ($localStorage.clusterUnits[i].id === id) {
                    $localStorage.clusterUnits.splice(i, 1);
                    $log.debug('Unit ' + id + ' removed from cluster');
                    return true;
                }
            }
            return false;
        }

        function resolveHostname(unit) {
            var systemSettings = dataServices[unit.id].getSystemSettings();
            systemSettings.$promise.then(function() {
                unit.hostname = systemSettings.hostname;
            });
        }

        function getColors() {
            return colors;
        }

        function getNextFreeColor() {
            var i;
            var reserved = [];
            for (i = 0; i < $localStorage.clusterUnits.length; i++) {
                reserved.push($localStorage.clusterUnits[i].color);
            }
            for (i = 0; i < colors.length; i++) {
                if (reserved.indexOf(colors[i].hex) === -1) {
                    return colors[i].hex;
                }
            }
            // no free labels left
            return null;
        }

        function startStatusPoller() {
            return $interval(pollStatuses, statusInterval);
        }

        function pollStatuses() {
            for (var i = 0; i < $localStorage.clusterUnits.length; i++) {
                pollStatus($localStorage.clusterUnits[i].id);
            }
        }

        function pollStatus(unitId) {
            dataServices[unitId].getStatus({
                // no need for lists here
                lists: []
            })
            .then(function(response) {
                var newStatus = response.data;
                if (statuses[unitId] === undefined) {
                    statuses[unitId] = {};
                }
                // save new status only when status changes
                if (!angular.equals(newStatus, statuses[unitId])) {
                    angular.copy(newStatus, statuses[unitId]);
                }
            }, function(errorResponse) {
                $log.error('No status response from unit', unitId, errorResponse);
            });
        }
    }
})();
