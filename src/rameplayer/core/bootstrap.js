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
//        var $resource = initInjector.get('$resource');

        // settingsUrl is defined in HTML
        var settingsUrl = initInjector.get('settingsUrl');
        core.constant('settingsUrl', settingsUrl);

//        var settingsResource = $resource(settingsUrl);
//        settingsResource.stripTrailingSlashes = false;
//        
//        return settingsResource.get().$promise.
//            then(function(response) {
//                $log.info('Fetching settings', response);
//                core.constant('settings', settingsResource);
//            },
//            function(errorResponse) {
//                $log.error('Error when fetching settings', errorResponse);
//            });

        return $http.get(settingsUrl)
            .then(function(response) {
                $log.info('Fetching settings', response);
                core.constant('settings', response.data);
            },
            function(errorResponse) {
                $log.error('Error when fetching settings', errorResponse);
            });
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['rameplayer']);
        });
    }

})();
