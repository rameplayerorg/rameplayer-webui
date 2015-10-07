/**
 * Rameplayer-WebUI
 * Copyright (C) 2015
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

    dataService.$inject = ['$http'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($http) {
        var urlPrefix = 'stubs';

        var service = {
            selected: function() { },
            getLists: getLists,
            play: play,
            pause: pause
        };

        return service;

        function getLists() {
            return $http.get(urlPrefix + '/lists.json');
        }

        function play(media) {
            var url = '/player/play/';
            url += window.encodeURIComponent(media.uri);
            return $http.get(url);
        }

        function pause() {
            return $http.get(urlPrefix + '/player/pause');
        }
    }
})();
