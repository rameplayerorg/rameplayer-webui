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

    dataService.$inject = ['$http', '$resource', 'settings'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($http, $resource, settings) {

        var Playlists = $resource(settings.urls.playlists);
        var DefaultPlaylist = $resource(settings.urls.defaultPlaylist);

        var service = {
            getLists: getLists,
            getDefaultPlaylist: getDefaultPlaylist,
            getPlaylists: getPlaylists,
            getPlayerStatus: getPlayerStatus,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek
        };

        return service;

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getDefaultPlaylist() {
            return DefaultPlaylist.get();
        }

        function getPlaylists() {
            return Playlists.query();
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

        function stop() {
            return $http.get(settings.urls.player + '/stop');
        }

        function seek(position) {
            return $http.get(settings.urls.player + '/seek/' + position);
        }
    }
})();
