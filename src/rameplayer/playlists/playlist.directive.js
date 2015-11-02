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
                removeMedia: '&',
                onSort: '&'
            },
            templateUrl: 'rameplayer/playlists/playlist.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.isDefaultPlaylist = (attrs.default !== undefined);
            scope.defaultPlaylist = scope.isDefaultPlaylist ? 'true' : 'false';
            scope.sortableOptions = {
                handle: '.sorting-handle',
                animation: 150,
                onSort: function(evt) {
                    scope.onSort({ playlist: scope.playlist, medias: evt.models });
                }
            };
        }
    }
})();
