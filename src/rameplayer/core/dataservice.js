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
            settings.development.serverSimulation &&
            settings.development.serverSimulation.enabled) {
            // replace this with simulationDataService
            return simulationDataService;
        }

        // make a copy of URLs so we don't overwrite server URL settings
        var urls = angular.copy(settings.urls);

        if (settings.serverPort !== undefined && settings.serverPort !== 0) {
            // apply server port to all URLs
            for (var prop in urls) {
                urls[prop] = location.protocol + '//' + location.hostname +
                    ':' + settings.serverPort + urls[prop];
            }
        }

        var listUrl = urls.lists + '/:targetId';
        var List = $resource(listUrl, { targetId: '@id' });

        var playlistUrl = urls.playlists + '/:playlistId';
        var playlistItemUrl = playlistUrl + '/items/:itemId';
        var Playlist = $resource(playlistUrl, { playlistId: '@id' });
        var PlaylistItem = $resource(playlistItemUrl,
            {
                playlistId: '@playlistId',
                itemId: '@id'
            },
            {
                'update': { method: 'PUT' }
            }
        );
        var DefaultPlaylist = $resource(urls.defaultPlaylist);
        var DefaultPlaylistItem = $resource(urls.defaultPlaylist + '/items/:itemId', { itemId: '@id' });

        var service = {
            getStatus: getStatus,
            setCursor: setCursor,
            getList: getList,
            getDefaultPlaylist: getDefaultPlaylist,
            addToDefaultPlaylist: addToDefaultPlaylist,
            removeFromDefaultPlaylist: removeFromDefaultPlaylist,
            getPlaylists: getPlaylists,
            createPlaylist: createPlaylist,
            movePlaylistItem: movePlaylistItem,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            stepBackward: stepBackward,
            stepForward: stepForward,
            getRameVersioning: getRameVersioning
        };

        return service;

        function getStatus() {
            return $http.get(urls['status']);
        }

        function setCursor(itemId) {
            return $http.put(urls.cursor, { id: itemId });
        }

        function getList(id) {
            return List.get({ targetId: id });
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
            return Playlist.query();
        }

        function createPlaylist(playlist) {
            Playlist.save(playlist, function() {
            });
        }

        function movePlaylistItem(playlist, item, oldIndex, newIndex) {
            PlaylistItem.update({}, {
                id: item.id,
                playlistId: playlist.id,
                oldIndex: oldIndex,
                newIndex: newIndex
            });
        }

        function play() {
            return $http.get(urls.player + '/play');
        }

        function pause() {
            return $http.get(urls.player + '/pause');
        }

        function stop() {
            return $http.get(urls.player + '/stop');
        }

        function seek(position) {
            return $http.get(urls.player + '/seek/' + position);
        }

        function stepBackward() {
            return $http.get(urls.player + '/step-backward');
        }

        function stepForward() {
            return $http.get(urls.player + '/step-forward');
        }

        function getRameVersioning() {
            return $http.get('stubs/rameversion.json');
        }
    }
})();
