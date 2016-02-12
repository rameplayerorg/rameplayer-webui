/*jshint maxcomplexity:9 */
/*jshint maxstatements:55 */

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
        .factory('dataServiceProvider', dataServiceProvider);

    dataServiceProvider.$inject = ['$log', '$http', '$resource', '$location',
        'simulationDataService', 'listProvider', 'ListIds', 'uiVersion', 'toastr',
        '$translate'];

    /**
     * @namespace DataServiceProvider
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataServiceProvider($log, $http, $resource, $location, simulationDataService, listProvider,
                         ListIds, uiVersion, toastr, $translate) {
        var service = {
            create: create
        };

        return service;

        function create(options) {
            return new DataService(options);
        }

        function DataService(options) {
            // ds for DataService
            var ds = this;
            $log.debug('DataService options', options);
            ds.options = options;

            if (ds.options.simulation) {
                // replace this with simulationDataService
                return simulationDataService;
            }

            var baseUrl = getBaseUrl();
            var Settings = $resource(baseUrl + 'settings/user/');
            var SystemSettings = $resource(baseUrl + 'settings/system/');
            var List = listProvider.getResource(baseUrl + 'lists/:id');
            var listItemUrl = baseUrl + 'lists/:listId/items/:itemId';
            var ListItem = $resource(listItemUrl, {
                listId: '',
                itemId: ''
            }, {
                update: {
                    method: 'PUT'
                }
            });

            var rameVersioning;

            ds.checkVersion = checkVersion;
            ds.getSettings = getSettings;
            ds.getStatus = getStatus;
            ds.setCursor = setCursor;
            ds.getList = getList;
            ds.addToPlaylist = addToPlaylist;
            ds.addStreamToPlaylist = addStreamToPlaylist;
            ds.removeFromPlaylist = removeFromPlaylist;
            ds.movePlaylistItem = movePlaylistItem;
            ds.createPlaylist = createPlaylist;
            ds.removePlaylist = removePlaylist;
            ds.clearPlaylist = clearPlaylist;
            ds.play = play;
            ds.pause = pause;
            ds.stop = stop;
            ds.seek = seek;
            ds.stepBackward = stepBackward;
            ds.stepForward = stepForward;
            ds.getRameVersioning = getRameVersioning;
            ds.getSystemSettings = getSystemSettings;

            checkVersion();

            /**
             * @name getBaseUrl
             * @desc Returns base URL for REST API calls. Optionally you can pass
             * hostname, port and basePath as parameters.
             * @returns string
             */
            function getBaseUrl(hostname, port, basePath) {
                hostname = hostname || ds.options.host;
                port = port || ds.options.port;
                basePath = basePath || ds.options.basePath || '/';
                var url = '';
                if (hostname || port) {
                    url = location.protocol + '//';
                    // from location.host, strip away possible port
                    url += hostname || location.host.split(':')[0];
                    if (port) {
                        url += ':' + port;
                    }
                }
                url += basePath;
                return url;
            }

            /**
             * @name checkVersion
             * @desc Checks if server version is compatible with this version of WebUI.
             * @returns boolean
             */
            function checkVersion() {
                if (uiVersion !== 'development') {
                    getRameVersioning().then(function(response) {
                        if (!serverIsCompatible(response.data.backend)) {
                            var host = ds.options.host || location.host.split(':')[0];
                            var msg = 'Server version ' + response.data.backend + ' at ' +
                                host + ':' + ds.options.port +
                                ' is incompatible with Web UI ' + uiVersion + '.';

                            $translate(['INCOMPATIBLE_VERSION']).then(function(translations) {
                                toastr.warning(msg, translations.INCOMPATIBLE_VERSION, {
                                    timeOut: 0,
                                    extendedTimeOut: 0,
                                    tapToDismiss: false,
                                    closeButton: true
                                });
                            });
                        }
                    });
                }
            }

            /**
             * @name serverIsCompatible
             * @desc Returns true if given server version is compatible with this
             * Web UI version
             * @return boolean
             */
            function serverIsCompatible(backendVersion) {
                if (backendVersion === 'development') {
                    return true;
                }
                var uiVersions = uiVersion.split('.');
                var backendVersions = backendVersion.split('.');
                if (uiVersions.length < 2 || backendVersions.length < 2) {
                    return false;
                }
                if (uiVersions[0] !== backendVersions[0]) {
                    // major version mismatch
                    return false;
                }
                var uiMinor = parseInt(uiVersions[1]);
                var backendMinor = parseInt(backendVersions[1]);
                if (backendMinor < uiMinor) {
                    // minor version is too old
                    return false;
                }
                return true;
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

            /**
             * @name getSystemSettings
             * @desc Returns instance object of SystemSettings $resource. You can save
             * settings by calling returned object.$save();
             * @returns object
             */
            function getSystemSettings() {
                return SystemSettings.get();
            }

            function getStatus(payload) {
                return $http.post(baseUrl + 'status', payload);
            }

            function setCursor(itemId) {
                return $http.put(baseUrl + 'cursor', {
                    id: itemId
                });
            }

            function getList(id) {
                return List.get({
                    id: id
                });
            }

            function addToPlaylist(listId, item) {
                var newItem = new ListItem({
                    uri: item.uri
                });
                return newItem.$save({
                    listId: listId,
                    itemId: ''
                });
            }

            function addStreamToPlaylist(listId, item) {
                var newItem = new ListItem({
                    title: item.title,
                    uri: item.uri
                });
                return newItem.$save({
                    listId: listId,
                    itemId: ''
                });
            }

            function removeFromPlaylist(listId, mediaItem) {
                return ListItem.delete({
                    listId: listId,
                    itemId: mediaItem.id
                });
            }

            function movePlaylistItem(listId, item, afterId) {
                return ListItem.update({
                    // url variables
                    listId: listId,
                    itemId: item.id,
                }, {
                    // payload
                    afterId: afterId
                });
            }

            function createPlaylist(playlist) {
                var newPlaylist = new List(playlist);
                return newPlaylist.$save({
                    id: ''
                });
            }

            function removePlaylist(id) {
                return List.delete({
                    id: id
                });
            }

            function clearPlaylist(id) {
                return ListItem.delete({
                    listId: id,
                    itemId: ''
                });
            }

            function play(delay) {

                var url = baseUrl + 'player/play';
                if (delay) {
                    url += '?delay=' + delay;
                }
                return $http.get(url);
            }

            function pause(delay) {
                var url = baseUrl + 'player/pause';
                if (delay) {
                    url += '?delay=' + delay;
                }
                return $http.get(url);
            }

            function stop(delay) {
                var url = baseUrl + 'player/stop';
                if (delay) {
                    url += '?delay=' + delay;
                }
                return $http.get(url);
            }

            function seek(position, delay) {
                var url = baseUrl + 'player/seek/' + position;
                if (delay) {
                    url += '?delay=' + delay;
                }
                return $http.get(url);
            }

            function stepBackward() {
                return $http.get(baseUrl + 'player/step-backward');
            }

            function stepForward() {
                return $http.get(baseUrl + 'player/step-forward');
            }

            function getRameVersioning() {
                // cache version information
                if (rameVersioning === undefined) {
                    rameVersioning = $http.get(baseUrl + 'version');
                }
                return rameVersioning;
            }
        }
    }
})();
