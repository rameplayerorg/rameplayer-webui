/**
 * Rameplayer WebUI
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

    dataService.$inject = ['$http', 'settings'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($http, settings) {
        var service = {
            getLists: getLists,
            getPlayerStatus: getPlayerStatus,
            play: play,
            pause: pause
        };

        return service;

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getPlayerStatus() {
            return $http.get(settings.urls.player + '/status');
        }

        function play(media) {
            var url = settings.urls.player + '/play/';
            url += window.encodeURIComponent(media.uri);
            return $http.get(url);
        }

        function pause() {
            return $http.get(settings.urls.player + '/pause');
        }
    }
})();
