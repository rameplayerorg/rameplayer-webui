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

    dataService.$inject = ['$log', '$http', '$resource', '$location', 'settings', 'simulationDataService', 'listProvider', 'getBaseUrl'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($log, $http, $resource, $location, settings, simulationDataService, listProvider, getBaseUrl) {

        if (settings.development && settings.development.enabled &&
            settings.development.serverSimulation &&
            settings.development.serverSimulation.enabled) {
            // replace this with simulationDataService
            return simulationDataService;
        }

        var baseUrl = getBaseUrl();
        var List = listProvider.getResource(baseUrl + 'lists/:targetId');
        var playlistUrl = baseUrl + 'playlists/:playlistId';
        var Playlist = $resource(playlistUrl, { playlistId: '@id' });
        var playlistItemUrl = baseUrl + 'playlists/:playlistId/items/:itemId';
        var PlaylistItem = $resource(playlistItemUrl,
            {
                playlistId: '@playlistId',
                itemId: '@id'
            },
            {
                'update': { method: 'PUT' }
            }
        );
        var DefaultPlaylist = $resource(baseUrl + 'playlists/default');
        var DefaultPlaylistItem = $resource(baseUrl + 'playlists/default/items/:itemId', { itemId: '@id' });

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

        function getStatus(payload) {
            return $http.post(baseUrl + 'status', payload);
        }

        function setCursor(itemId) {
            return $http.put(baseUrl + 'cursor', { id: itemId });
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
            return $http.get(baseUrl + 'player/play');
        }

        function pause() {
            return $http.get(baseUrl + 'player/pause');
        }

        function stop() {
            return $http.get(baseUrl + 'player/stop');
        }

        function seek(position) {
            return $http.get(baseUrl + 'player/seek/' + position);
        }

        function stepBackward() {
            return $http.get(baseUrl + 'player/step-backward');
        }

        function stepForward() {
            return $http.get(baseUrl + 'player/step-forward');
        }

        function getRameVersioning() {
            return $http.get(baseUrl + 'rameversion');
        }
    }
})();
