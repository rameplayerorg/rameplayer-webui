(function() {
    'use strict';

    var module = angular
        .module('rameplayer.core');

    module
        // minimum server version, used in dataServiceProvider checkVersion()
        .constant('minServerVersion', '0.9.0')
        .constant('ItemTypes', {
            DEVICE: 'device',
            DIRECTORY: 'directory',
            SINGLE: 'regular',
            PLAYLIST: 'playlist'
        })
        .constant('ListIds', {
            ROOT: 'root',
            DEFAULT_PLAYLIST: 'default',
            AUTOPLAY: 'autoplay', // title, not id
        })
        .constant('reportServerEntry', 'http://dev.rameplayer.org/reports/config.php');

    // rameServerConfig
    if (typeof rameServerConfig !== 'undefined') {
        module.constant('serverConfig', rameServerConfig); // jshint ignore:line
    }
    else {
        // default value if rameServerConfig variable is missing
        module.constant('serverConfig', {
            basePath: 'stubs/',
            simulation: true
        });
    }

})();
