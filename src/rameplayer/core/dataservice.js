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
            setCursor: setCursor,
            getLists: getLists,
            getDefaultPlaylist: getDefaultPlaylist,
            getPlaylists: getPlaylists,
            createPlaylist: createPlaylist,
            getPlayerStatus: getPlayerStatus,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            getRameVersioning: getRameVersioning
        };

        if (settings.serverPort !== undefined && settings.serverPort !== 0) {
            settings.urls.player = location.protocol + '//' + location.hostname +
                                   ':' + settings.serverPort + '/player';
            settings.urls.lists = location.protocol + '//' + location.hostname +
                                   ':' + settings.serverPort + '/lists';
	}

        return service;

        function setCursor(itemId) {
            return $http.put(settings.urls.cursor, { id: itemId });
        }

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getDefaultPlaylist() {
            return DefaultPlaylist.get();
        }

        function getPlaylists() {
            return Playlists.query();
        }

        function createPlaylist(playlist) {
            var newPlaylist = new Playlists();
            newPlaylist.title = playlist.title;
            Playlists.save(playlist, function() {
            });
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

        function getRameVersioning() {
            return $http.get('stubs/rameversion.json');
        }
    }
})();
