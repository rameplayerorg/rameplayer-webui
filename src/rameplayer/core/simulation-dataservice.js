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

    simulationDataService.$inject = ['$log', '$http', '$resource', 'settings',
        '$timeout', '$interval', 'uuid'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($log, $http, $resource, settings, $timeout, $interval, uuid) {

        // initial internal data
        // corresponds server data in production
        var server = {
            status: {
                state: 'stopped',
                position: 0,
                cursor: {
                    id: 'af8408b7-7474-4d99-99c8-2bb9fc524f0f'
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
            movePlaylistItem: movePlaylistItem,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            stepBackward: stepBackward,
            stepForward: stepForward,
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
        var playingPromise;

        return service;

        function getStatus() {
            return $timeout(function() {
                //$log.info('getStatus', data.status);
                return { data: server.status };
            }, delay);
        }

        function setCursor(itemId) {
            return $timeout(function() {
                if (server.status.state !== 'playing') {
                    server.status.cursor.id = itemId;
                    $log.info('Cursor set to', itemId);
                }
                else {
                    $log.info('Playing, not changing cursor');
                }
            }, delay);
        }

        function getLists() {
            return $http.get(settings.urls.lists);
        }

        function getDefaultPlaylist() {
            return server.defaultPlaylist;
        }

        function addToDefaultPlaylist(mediaItem) {
            return $timeout(function() {
                var newItem = angular.copy(mediaItem);
                // generate new UUID
                newItem.id = uuid.v4();
                server.defaultPlaylist.items.push(newItem);
                var date = new Date();
                server.defaultPlaylist.modified = date.getTime();
                server.status.playlists.modified = date.getTime();
                return;
            }, delay);
        }

        function removeFromDefaultPlaylist(mediaItem) {
            return $timeout(function() {
                for (var i = 0; i < server.defaultPlaylist.items.length; i++) {
                    if (server.defaultPlaylist.items[i].id === mediaItem.id) {
                        server.defaultPlaylist.items.splice(i, 1);
                        var date = new Date();
                        server.defaultPlaylist.modified = date.getTime();
                        server.status.playlists.modified = date.getTime();
                    }
                }
            }, delay);
        }

        function getPlaylists() {
            return server.playlists;
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
                server.playlists.push(newPlaylist);
                server.status.playlists.modified = date.getTime();
            }, delay);
        }

        function movePlaylistItem(playlist, item, oldIndex, newIndex) {
            return $timeout(function() {
                $log.info('Playlist item moved');
            }, delay);
        }

        function play() {
            return $timeout(function() {
                $log.info('Playing');
                server.status.state = 'playing';
                playingPromise = $interval(function() {
                    server.status.position += 1.0;
                    if (server.status.position >= server.status.cursor.item.duration) {
                        $log.info('Playing ended');
                        $interval.cancel(playingPromise);
                        server.status.state = 'stopped';
                        server.status.position = 0;
                    }
                }, 1000);
            }, delay);
        }

        function pause() {
            return $timeout(function() {
                $log.info('Paused');
                server.status.state = 'paused';
                $interval.cancel(playingPromise);
            });
        }

        function stop() {
            return $timeout(function() {
                $log.info('Stopped');
                server.status.state = 'stopped';
                server.status.position = 0;
                $interval.cancel(playingPromise);
            });
        }

        function seek(position) {
            return $timeout(function() {
                $log.info('seeked to position', position);
                server.status.position = position;
            });
        }

        function stepBackward() {
        }

        function stepForward() {
        }

        function getRameVersioning() {
            return $http.get('stubs/rameversion.json');
        }
    }
})();
