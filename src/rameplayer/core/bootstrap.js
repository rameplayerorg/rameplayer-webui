/**
 * Rameplayer WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * This is run as first.
 * Loads settings from server and then bootstraps the application.
 * Consider removing this and giving settings in index.html, which
 * bootstraps faster the application.
 *
 * By the way, this file has nothing to do with Bootstrap UI. ;)
 *
 * Based on idea in
 * https://blog.mariusschulz.com/2014/10/22/asynchronously-bootstrapping-angularjs-applications-with-server-side-data
 */
(function() {
    var core = angular.module('rameplayer.core');

    fetchSettings().then(bootstrapApplication);

    function fetchSettings() {
        var initInjector = angular.injector(['ng', 'rameplayer.core']);
        var $http = initInjector.get('$http');
        var $log = initInjector.get('$log');
        var $resource = initInjector.get('$resource');

        core.constant('getBaseUrl', getBaseUrl);
        var settingsUrl = 'stubs/settings.json';
        //var settingsUrl = getBaseUrl() + 'settings';
        core.constant('settingsUrl', settingsUrl);

        var SettingsResource = $resource(settingsUrl);
        SettingsResource.stripTrailingSlashes = false;
        var settings = SettingsResource.get();

        // global constant settings is a resource reference
        core.constant('settings', settings);
        return settings.$promise.
            then(function(response) {
                $log.info('Settings fetched', response);
            },
            function(errorResponse) {
                $log.error('Error when fetching settings', errorResponse);
            });


        /**
         * @name getBaseUrl
         * @desc Returns base URL for REST API calls
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
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['rameplayer']);
        });
    }
})();
