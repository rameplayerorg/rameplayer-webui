(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        // minimum server version, used in dataServiceProvider checkVersion()
        .constant('minServerVersion', '0.6.0')
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
