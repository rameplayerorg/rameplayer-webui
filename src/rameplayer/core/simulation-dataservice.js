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
        .factory('simulationDataService', simulationDataService);

    simulationDataService.$inject = ['$log', '$http', '$resource', 'settings', '$timeout', 'uuid'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($log, $http, $resource, settings, $timeout, uuid) {

        // initial internal data
        // corresponds server data in production
        var data = {
            status: {
                state: 'stopped',
                position: 0,
                cursor: {
                    id: 0,
                },
                playlists: {
                    modified: 0
                },
                lists: {
                    modified: 0
                }
            },
            defaultPlaylist: {
                items: []
            },
            playlists: []
        };

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

        var delay = settings.development.simulationDelay;

        return service;

        function getStatus() {
            return $timeout(function() {
                $log.info('getStatus', data.status);
                return { data: data.status };
            }, delay);
        }

        function setCursor(itemId) {
            return $timeout(function() {
                data.status.cursor.id = itemId;
                $log.info('Cursor set to', itemId);
            }, delay);
        }

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getDefaultPlaylist() {
            return data.defaultPlaylist;
        }

        function addToDefaultPlaylist(mediaItem) {
            return $timeout(function() {
                var newItem = angular.copy(mediaItem);
                // generate new UUID
                newItem.id = uuid.v4();
                data.defaultPlaylist.items.push(newItem);
                var date = new Date();
                data.defaultPlaylist.modified = date.getTime();
                data.status.playlists.modified = date.getTime();
                return;
            }, delay);
        }

        function removeFromDefaultPlaylist(mediaItem) {
            return $timeout(function() {
                for (var i = 0; i < data.defaultPlaylist.items.length; i++) {
                    if (data.defaultPlaylist.items[i].id === mediaItem.id) {
                        data.defaultPlaylist.items.splice(i, 1);
                        var date = new Date();
                        data.defaultPlaylist.modified = date.getTime();
                        data.status.playlists.modified = date.getTime();
                    }
                }
            }, delay);
        }

        function getPlaylists() {
            return data.playlists;
        }

        function createPlaylist(playlist) {
            return $timeout(function() {
                var date = new Date();
                var newPlaylist = {
                    title: playlist.title,
                    items: [],
                    modified: date.getTime()
                };
                for (var i = 0; i < playlist.items.length; i++) {
                    var newItem = angular.copy(playlist.items[i]);
                    // generate new UUID
                    newItem.id = uuid.v4();
                    newPlaylist.items.push(newItem);
                }
                data.playlists.push(newPlaylist);
                data.status.playlists.modified = date.getTime();
            }, delay);
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
