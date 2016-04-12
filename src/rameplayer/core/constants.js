(function() {
    'use strict';

    if (typeof rameServerConfig === 'undefined') { // jshint ignore:line
        // default value for rameServerConfig if not defined
        var rameServerConfig = { // jshint ignore:line
            basePath: 'stubs/',
            simulation: true
        };
    }

    angular
        .module('rameplayer.core')
        // minimum server version, used in dataServiceProvider checkVersion()
        .constant('minServerVersion', '0.7.0')
        .constant('ItemTypes', {
            DEVICE: 'device',
            DIRECTORY: 'directory',
            SINGLE: 'regular',
            PLAYLIST: 'playlist'
        })
        .constant('ListIds', {
            ROOT: 'root',
            DEFAULT_PLAYLIST: 'default'
        })
        .constant('reportServerEntry', 'http://dev.rameplayer.org/reports/config.php')
        .constant('serverConfig', rameServerConfig); // jshint ignore:line
})();
