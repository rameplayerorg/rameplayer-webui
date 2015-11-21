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

    simulationDataService.$inject = ['$log', '$http', '$resource', 'settings', '$timeout', '$interval', 'uuid'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($log, $http, $resource, settings, $timeout, $interval, uuid) {

        // initial internal data
        // corresponds server data in production
        var data = {
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
        var playingPromise;

        return service;

        function getStatus() {
            return $timeout(function() {
                //$log.info('getStatus', data.status);
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
            return $timeout(function() {
                $log.info('Playing');
                data.status.state = 'playing';
                playingPromise = $interval(function() {
                    data.status.position += 1.0;
                    if (data.status.position >= data.status.cursor.item.duration) {
                        $interval.cancel(playingPromise);
                        data.status.state = 'stopped';
                        data.status.position = 0;
                    }
                }, 1000);
            }, delay);
        }

        function pause() {
            return $timeout(function() {
                $log.info('Paused');
                data.status.state = 'paused';
                $interval.cancel(playingPromise);
            });
        }

        function stop() {
            return $timeout(function() {
                $log.info('Stopped');
                data.status.state = 'stopped';
                data.status.position = 0;
                $interval.cancel(playingPromise);
            });
        }

        function seek(position) {
            return $timeout(function() {
                $log.info('seeked to position', position);
                data.status.position = position;
            });
        }

        function getRameVersioning() {
            return $http.get('stubs/rameversion.json');
        }
    }
})();
