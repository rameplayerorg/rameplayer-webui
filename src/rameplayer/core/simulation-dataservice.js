/*jshint maxparams:12 */
/*jshint maxcomplexity:9 */
/*jshint maxstatements:46 */

/**
 * Rameplayer WebUI
 * Copyright (C) 2015-2016
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
        '$timeout', '$interval', '$q', 'uuid', 'listProvider', 'ListIds',
        '$location', 'serverConfig'
    ];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function simulationDataService($rootScope, $log, $http, $resource,
                                   $timeout, $interval, $q, uuid, listProvider, ListIds,
                                   $location, serverConfig) {
        // initial internal data
        // corresponds server data in production
        var server = {
            status: {
                state: 'stopped',
                position: 0,
                cursor: {
                    parentId: 'sda1',
                    id: 'sda1:%2f00_pk_FI_000_r720P%2emp4'
                },
                listsRefreshed: {
                    'default': 1403136766000
                },
                player: {
                    //rebootRequired: true,
                    //updateAvailable: true
                }
            },
            defaultPlaylist: {
                id: 'default',
                items: [],
                '$save': function() {
                },
                // empty promise
                '$promise': $q.when()
            },
            playlists: []
        };

        var baseUrl = getBaseUrl();
        var Settings = $resource(baseUrl + 'settings.json');
        var List = listProvider.getResource(baseUrl + 'lists/:id.json');
        var SystemSettings = {
            'audioPort': 'rameAnalogOnly',
            'ipDhcpClient': true,
            'resolution': 'rameAutodetect',
            '$save': function(func) {
                $log.info('Saving system settings');
                func();
            },
            // empty promise
            '$promise': $q.when()
        };
        var FirmwareUpgradesAvailable =
            {
                'firmwares': [
                 {
                'title': 'Release 1.0.0',
                'uri': 'rsync://example.org/',
                'date': '2016-02-09 13:57',
                'stable': false,
                'latest': false},
                {'title': 'Release 1.0.1',
                 'uri': 'rsync://example.org/',
                 'date': '2016-02-11 13:57',
                 'stable': true,
                 'latest': true}
                ],
                '$promise': $q.when()
            };

        var audioConfig = {
            channels: [
                {
                    id: 'headphone',
                    min: 0,
                    max: 110,
                    volume: 80,
                },
                {
                    id: 'lineout',
                    min: 0,
                    max: 110,
                    volume: 100
                }
            ]
        };

        var service = {
            getSettings: getSettings,
            getStatus: getStatus,
            setCursor: setCursor,
            getList: getList,
            addToPlaylist: addToPlaylist,
            addStreamToPlaylist: addStreamToPlaylist,
            removeFromPlaylist: removeFromPlaylist,
            movePlaylistItem: movePlaylistItem,
            createPlaylist: createPlaylist,
            removePlaylist: removePlaylist,
            clearPlaylist: clearPlaylist,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            stepBackward: stepBackward,
            stepForward: stepForward,
            getRameVersioning: getRameVersioning,
            getFirmwareUpgradesAvailable: getFirmwareUpgradesAvailable,
            upgradeFirmware: upgradeFirmware,
            getSystemSettings: getSystemSettings,
            writeLog: writeLog,
            getLog: getLog,
            getReportConfig: getReportConfig,
            sendReport: sendReport,
            getAudio: getAudio,
            setVolume: setVolume
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
            hostname = hostname || serverConfig.host;
            port = port || serverConfig.port;
            basePath = basePath || serverConfig.basePath || '/';
            var url = '';
            if (hostname || port) {
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
                return {
                    data: server.status
                };
            }, delay);
        }

        function setCursor(itemId) {
            return $timeout(function() {
                if (server.status.state !== 'playing' && server.status.state !== 'buffering') {
                    var result = findItem(itemId);
                    if (result) {
                        server.status.cursor.id = result.item.id;
                        server.status.cursor.parentId = result.parentId;
                        $log.info('Cursor set to', result);
                    }
                    else {
                        $log.info('Item not found for cursor item', itemId);
                    }
                }
                else {
                    $log.info('Playing, not changing cursor');
                }
            }, delay);
        }

        function getList(id) {
            $log.debug('getList', id);
            if (id === ListIds.ROOT ||
                id.indexOf('sda1') === 0 ||
                id.indexOf('my-playlist') === 0) {
                // if id starts with 'sda1' or 'my-playlist', fetch it with ajax
                var list = List.get(
                    {
                        id: id
                    }
                );
                list.$promise.then(function(list) {
                    server.status.listsRefreshed[id] = list.refreshed || '';
                });
                return list;
            }
            else if (id === ListIds.DEFAULT_PLAYLIST) {
                return server.defaultPlaylist;
            }
            else {
                if ($rootScope.lists[id] === undefined) {
                    $log.error('List ' + id + ' not found from $rootScope.lists');
                }
                return $rootScope.lists[id];
            }
        }

        function addToPlaylist(listId, mediaItem) {
            return $timeout(function() {
                var newItem = angular.copy(mediaItem);
                // generate new UUID
                newItem.id = uuid.v4();
                $rootScope.lists['default'].items.push(newItem);
                var date = new Date();
                $rootScope.lists['default'].refreshed = date.getTime();
                server.status.listsRefreshed['default'] = date.getTime();
            }, delay);
        }

        function addStreamToPlaylist(listId, mediaItem) {
            return $timeout(function() {
                var playlist = $rootScope.lists[listId];
                var date = new Date();
                var now = date.getTime();
                var newItem = {
                    name: mediaItem.uri,
                    title: mediaItem.title,
                    uri: mediaItem.uri,
                    modified: now
                };
                // generate new UUID
                newItem.id = uuid.v4();
                playlist.items.push(newItem);
                playlist.modified = now;
                server.status.listsRefreshed[listId] = now;
            }, delay);
        }

        function removeFromPlaylist(listId, mediaItem) {
            return $timeout(function() {
                $log.info('remove', listId, mediaItem);
                var playlist = $rootScope.lists[listId];
                for (var i = 0; i < playlist.items.length; i++) {
                    if (playlist.items[i].id === mediaItem.id) {
                        playlist.items.splice(i, 1);
                        var date = new Date();
                        server.status.listsRefreshed[listId] = date.getTime();
                    }
                }
            }, delay);
        }

        function getPlaylists() {
            return server.playlists;
        }

        function movePlaylistItem(playlist, item, afterId) {
            return $timeout(function() {
                $log.info('Playlist item moved');
            }, delay);
        }

        function createPlaylist(playlist) {
            return $timeout(function() {
                var date = new Date();
                var newId = uuid.v4();
                var newPlaylist = {
                    id: newId,
                    title: playlist.title,
                    refreshed: date.getTime(),
                    type: 'playlist',
                    items: []
                };
                for (var i = 0; i < playlist.items.length; i++) {
                    var result = findItemByUriTitle(playlist.items[i].uri, playlist.items[i].title);
                    if (result) {
                        var newItem = angular.copy(result.item);
                        // generate new UUID for item
                        newItem.id = uuid.v4();
                        newPlaylist.items.push(newItem);
                    }
                }
                // simulate empty $promise
                newPlaylist.$promise = $q.when(newPlaylist);
                server.playlists.push(newPlaylist);
                $rootScope.lists[newPlaylist.id] = newPlaylist;
                $log.info('new playlist', newPlaylist);
                server.status.listsRefreshed[newPlaylist.id] = newPlaylist.refreshed;

                // add to root playlist
                $rootScope.lists[ListIds.ROOT].items.push(newPlaylist);
            }, delay);
        }

        function removePlaylist(id) {
            return $timeout(function() {
                // remove from root playlist
                var rootList = $rootScope.lists[ListIds.ROOT];
                for (var i = 0; i < rootList.items.length; i++) {
                    if (rootList.items[i].id === id) {
                        rootList.items.splice(i, 1);
                    }
                }
                delete $rootScope.lists[id];
            });
        }

        function clearPlaylist(id) {
            return $timeout(function() {
                var date = new Date();
                $rootScope.lists[id].items = [];
                server.status.listsRefreshed[id] = date.getTime();
            });
        }

        function play() {
            return $timeout(function() {
                $log.info('Playing');
                server.status.state = 'playing';
                var result = findItem(server.status.cursor.id);
                server.status.duration = result.item.duration;
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
        
        function getFirmwareUpgradesAvailable() {
            return FirmwareUpgradesAvailable;
        }
        
        function upgradeFirmware(downloadURI) {
            return $timeout(function() {
                $log.info('upgrade firmware to ', downloadURI);
            }, delay);
        }

        // Returns item and parent list
        function findItem(itemId) {
            var listIds = Object.keys($rootScope.lists);
            for (var j = 0; j < listIds.length; j++) {
                var listId = listIds[j];
                for (var i = 0; i < $rootScope.lists[listId].items.length; i++) {
                    if (itemId === $rootScope.lists[listId].items[i].id) {
                        return {
                            parentId: listId,
                            item: $rootScope.lists[listId].items[i]
                        };
                    }
                }
            }
            // not found
            return null;
        }

        // Returns item and parent list by uri and title
        function findItemByUriTitle(uri, title) {
            var listIds = Object.keys($rootScope.lists);
            for (var j = 0; j < listIds.length; j++) {
                var listId = listIds[j];
                for (var i = 0; i < $rootScope.lists[listId].items.length; i++) {
                    var item = $rootScope.lists[listId].items[i];
                    if (uri === item.uri &&
                        title === item.title) {
                        return {
                            parentId: listId,
                            item: item
                        };
                    }
                }
            }
            // not found
            return null;
        }

        function findCursorItem(cursor) {
            var listId = cursor.parentId;
            if ($rootScope.lists[listId] && $rootScope.lists[listId].items) {
                for (var i = 0; i < $rootScope.lists[listId].items.length; i++) {
                    if (cursor.id === $rootScope.lists[listId].items[i].id) {
                        return $rootScope.lists[listId].items[i];
                    }
                }
            }
            // not found
            return null;
        }

        function writeLog(level, message) {
        }

        function getLog() {
            return $timeout(function() {
                return {
                };
            }, delay);
        }

        function getReportConfig() {
            return $timeout(function() {
                return {
                    data: {
                    }
                };
            }, delay);
        }

        function sendReport(url, data) {
            return $timeout(function() {
                return {
                };
            }, delay);
        }

        function getAudio() {
            return $timeout(function() {
                return {
                    data: audioConfig
                };
            }, delay);
        }

        function setVolume(channel, volume) {
            return $timeout(function() {
                return {
                };
            }, delay);
        }
    }
})();
