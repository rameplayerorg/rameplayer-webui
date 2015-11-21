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

    dataService.$inject = ['$log', '$http', '$resource', 'settings', 'simulationDataService'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($log, $http, $resource, settings, simulationDataService) {

        if (settings.development && settings.development.enabled &&
            settings.development.simulateServer) {
            // replace this with simulationDataService
            return simulationDataService;
        }

        var Playlists = $resource(settings.urls.playlists);
        var DefaultPlaylist = $resource(settings.urls.defaultPlaylist);
        var DefaultPlaylistItem = $resource(settings.urls.defaultPlaylist + '/items/:itemId', { itemId: '@id' });

        var service = {
            getStatus: getStatus,
            setCursor: setCursor,
            getLists: getLists,
            getDefaultPlaylist: getDefaultPlaylist,
            addToDefaultPlaylist: addToDefaultPlaylist,
            removeFromDefaultPlaylist: removeFromDefaultPlaylist,
            getPlaylists: getPlaylists,
            createPlaylist: createPlaylist,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            getRameVersioning: getRameVersioning
        };

        if (settings.serverPort !== undefined && settings.serverPort !== 0) {
            settings.urls['status'] = location.protocol + '//' + location.hostname +
                                   ':' + settings.serverPort + '/status';
            settings.urls.player = location.protocol + '//' + location.hostname +
                                   ':' + settings.serverPort + '/player';
            settings.urls.lists = location.protocol + '//' + location.hostname +
                                   ':' + settings.serverPort + '/lists';
	}

        return service;

        function getStatus() {
            return $http.get(settings.urls['status']);
        }

        function setCursor(itemId) {
            return $http.put(settings.urls.cursor, { id: itemId });
        }

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getDefaultPlaylist() {
            return DefaultPlaylist.get();
        }

        function addToDefaultPlaylist(mediaItem) {
            var newItem = new DefaultPlaylistItem();
            newItem.uri = mediaItem.uri;
            DefaultPlaylistItem.save(newItem, function() {
            });
        }

        function removeFromDefaultPlaylist(mediaItem) {
            DefaultPlaylistItem.delete({ itemId: mediaItem.id });
        }

        function getPlaylists() {
            return Playlists.query();
        }

        function createPlaylist(playlist) {
            Playlists.save(playlist, function() {
            });
        }

        function play() {
            return $http.get(settings.urls.player + '/play');
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
