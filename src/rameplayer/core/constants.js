(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .constant('ItemTypes', {
            LIST: 'directory',
            SINGLE: 'regular',
            PLAYLIST: 'playlist'
        })
        .constant('ListIds', {
            ROOT: 'root',
            DEFAULT_PLAYLIST: 'default'
        });
})();
