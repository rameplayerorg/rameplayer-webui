(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        // minimum server version, used in dataServiceProvider checkVersion()
        .constant('minServerVersion', '0.4.0')
        .constant('ItemTypes', {
            LIST: 'directory',
            SINGLE: 'regular',
            PLAYLIST: 'playlist'
        })
        .constant('ListIds', {
            ROOT: 'root',
            DEFAULT_PLAYLIST: 'default'
        })
        .constant('serverConfig', rameServerConfig); // jshint ignore:line
})();
