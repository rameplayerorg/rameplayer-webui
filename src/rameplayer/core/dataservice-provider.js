/*jshint maxcomplexity:9 */
/*jshint maxstatements:50 */

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
        'simulationDataService', 'listProvider', 'ListIds'];

    /**
     * @namespace DataServiceProvider
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataServiceProvider($log, $http, $resource, $location, simulationDataService, listProvider,
                         ListIds) {
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

            function movePlaylistItem(listId, item, oldIndex, newIndex) {
                return ListItem.update({
                    // url variables
                    listId: listId,
                    itemId: item.id,
                }, {
                    // payload
                    oldIndex: oldIndex,
                    newIndex: newIndex
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
                return $http.get(baseUrl + 'version');
            }
        }
    }
})();
