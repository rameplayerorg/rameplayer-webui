(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .directive('ramePlaylist', ramePlaylist);

    function ramePlaylist() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E', // only element
            scope: {
                // get used playlist from attribute
                playlist: '=',
                removeMedia: '&'
            },
            templateUrl: 'rameplayer/playlists/playlist.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.defaultPlaylist = (attrs.default !== undefined) ? 'true' : 'false';
            scope.sortableOptions = {
                handle: '.sorting-handle',
                animation: 150,
                onUpdate: function() {
                    console.log('Playlist changed');
                }
            };
        }
    }
})();
