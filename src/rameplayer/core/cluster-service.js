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

        var service = {
            units: units,
            addUnit: addUnit,
            removeUnit: removeUnit
        };

        return service;

        function addUnit(address, port, delay, label) {
            var unit = {
                id: uuid.v4(),
                hostname: resolveHostname(address),
                address: address,
                port: port,
                delay: parseFloat(delay),
                label: label
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
    }
})();
