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

    simulationDataService.$inject = ['$rootScope', '$log', '$http', '$resource',
        '$timeout', '$interval', 'uuid', 'listProvider'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($rootScope, $log, $http, $resource, $timeout, $interval, uuid, listProvider) {
        // initial internal data
        // corresponds server data in production
        var server = {
            status: {
                state: 'buffering',
                position: 5,
                cursor: {
                    id: 'sda1:%2f02_pk_FI_002_r720P%2emp4'
                },
                listsRefreshed: {
                }
            },
            defaultPlaylist: {
                items: []
            },
            playlists: []
        };

        var baseUrl = getBaseUrl();
        var Settings = $resource(baseUrl + 'settings.json');
        var List = listProvider.getResource(baseUrl + 'lists/:targetId.json');
        var Playlists = $resource(baseUrl + 'playlists');
        var DefaultPlaylist = $resource(baseUrl + 'playlists/default');
        var DefaultPlaylistItem = $resource('playlists/default/items/:itemId', { itemId: '@id' });
        var SystemSettings = {
            "audioPort": "rameAnalogOnly",
            "ipDhcpClient": true,
            "resolution": "rameAutodetect",
            '$save': function(func) {
                $log.info('Saving system settings');
                func();
            }
        };

        var service = {
            getSettings: getSettings,
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
            getRameVersioning: getRameVersioning,
            getSystemSettings: getSystemSettings
        };

        var delay = 50;
        var playingPromise;

        return service;

        /**
         * @name getBaseUrl
         * @desc Returns base URL for REST API calls. Optionally you can pass
         * hostname, port and basePath as parameters.
         * @returns string
         */
        function getBaseUrl(hostname, port, basePath) {
            hostname = hostname || rameServerConfig.host;
            port = port || rameServerConfig.port;
            basePath = basePath || rameServerConfig.basePath || '/';
            var url = '';
            if (hostname || port) {
                // $location is not yet available here
                url = location.protocol + '//';
                url += hostname || location.host;
                if (port) {
                    url += ':' + port;
                }
            }
            url += basePath;
            return url;
        }

        /**
         * @name getSettings
         * @desc Returns instance object of Settings $resource. You can save
         * settings by calling returned object.$save();
         * @returns object
         */
        function getSettings() {
            return Settings.get();
        }

        function getStatus(payload) {
            return $timeout(function() {
                //$log.info('getStatus', server.status, payload);
                return { data: server.status };
            }, delay);
        }

        function setCursor(itemId) {
            return $timeout(function() {
                if (server.status.state !== 'playing' && server.status.state !== 'buffering') {
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
                server.status.duration = server.status.cursor.item.info.duration;
                playingPromise = $interval(function() {
                    server.status.position += 1.0;
                    if (server.status.position >= server.status.duration) {
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
            return $http.get(baseUrl + 'rameversion.json');
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

        function getSystemSettings() {
            return SystemSettings;
        }
    }
})();
