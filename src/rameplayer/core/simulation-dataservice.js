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

    simulationDataService.$inject = ['$rootScope', '$log', '$http', '$resource', 'settings',
        '$timeout', '$interval', 'uuid', 'List'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($rootScope, $log, $http, $resource, settings, $timeout, $interval, uuid, List) {

        // initial internal data
        // corresponds server data in production
        var server = {
            status: {
                state: 'stopped',
                position: 0,
                cursor: {
                    id: 'af8408b7-7474-4d99-99c8-2bb9fc524f0f'
                },
                listsRefreshed: {
                }
            },
            defaultPlaylist: {
                items: []
            },
            playlists: []
        };

        var urls = settings.development.serverSimulation.urls;
        var Playlists = $resource(urls.playlists);
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

        var delay = settings.development.serverSimulation.delay;
        var playingPromise;

        return service;

        function getStatus(payload) {
            return $timeout(function() {
                //$log.info('getStatus', server.status, payload);
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

        function getList(id) {
            var list = List.get({ targetId: id });
            list.$promise.then(function(list) {
                server.status.listsRefreshed[id] = list.refreshed || '';
            });
            return list;
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
                        serverStop();
                        $log.info('Playing ended');
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
                serverStop();
                $log.info('Stopped');
            });
        }

        function seek(position) {
            return $timeout(function() {
                $log.info('seeked to position', position);
                server.status.position = position;
            });
        }

        function stepBackward() {
            return $timeout(function() {
                serverStop();
                serverCursorBackward();
                $log.info('Step backward');
            }, delay);
        }

        function stepForward() {
            return $timeout(function() {
                serverStop();
                serverCursorForward();
                $log.info('Step forward');
            }, delay);
       }

        function getRameVersioning() {
            return $http.get('stubs/rameversion.json');
        }

        function serverStop() {
            server.status.state = 'stopped';
            server.status.position = 0;
            $interval.cancel(playingPromise);
        }

        function serverCursorForward() {
            if (server.status.cursor.parents && server.status.cursor.parents.length) {
                var playlist = server.status.cursor.parents[server.status.cursor.parents.length - 1];
                for (var i = 0; i < playlist.items.length; i++) {
                    if (server.status.cursor.id === playlist.items[i].id) {
                        var nextItem;
                        if (i === playlist.items.length - 1) {
                            nextItem = playlist.items[0];
                        }
                        else {
                            nextItem = playlist.items[i + 1];
                        }
                        server.status.cursor.id = nextItem.id;
                        break;
                    }
                }
            }
        }

        function serverCursorBackward() {
            if (server.status.cursor.parents && server.status.cursor.parents.length) {
                var playlist = server.status.cursor.parents[server.status.cursor.parents.length - 1];
                for (var i = 0; i < playlist.items.length; i++) {
                    if (server.status.cursor.id === playlist.items[i].id) {
                        var prevItem;
                        if (i === 0) {
                            prevItem = playlist.items[playlist.items.length - 1];
                        }
                        else {
                            prevItem = playlist.items[i - 1];
                        }
                        server.status.cursor.id = prevItem.id;
                        break;
                    }
                }
            }
        }

        function getListParent() {
            $log.info('getParent()', this);
        }
    }
})();
