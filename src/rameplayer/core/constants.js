(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .constant('ItemTypes', {
            LIST: 'directory',
            SINGLE: 'regular'
        })
        .constant('ListIds', {
            ROOT: 'root',
            DEFAULT_PLAYLIST: 'defaultPlaylist'
        });
})();
