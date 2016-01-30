/**
 * Rameplayer WebUI
 * Copyright (C) 2015-2016
 *
 * See LICENSE.
 */

/**
 * Data Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('dataService', dataService);

    dataService.$inject = ['dataServiceProvider', 'serverConfig'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService(dataServiceProvider, serverConfig) {
        var ds = dataServiceProvider.create(serverConfig);
        return ds;
    }
})();
