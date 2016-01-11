(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .directive('ramePlaylist', ramePlaylist);

    ramePlaylist.$inject = ['$rootScope', '$log', '$uibModal', 'dataService', 'ListIds'];

    function ramePlaylist($rootScope, $log, $uibModal, dataService, ListIds) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E', // only element
            scope: {
                // get used playlist from attribute
                targetId: '=',
                onMediaClick: '&',
                removeMedia: '&',
                onSort: '&',
                addStream: '&'
            },
            templateUrl: 'rameplayer/playlists/playlist.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.lists = $rootScope.lists;
            scope.isDefaultPlaylist = (attrs.default !== undefined);
            if (scope.isDefaultPlaylist) {
                scope.targetId = ListIds.DEFAULT_PLAYLIST;
            }
            scope.defaultPlaylist = scope.isDefaultPlaylist ? 'true' : 'false';
            scope.sortableOptions = {
                handle: '.sorting-handle',
                animation: 150,
                onSort: function(evt) {
                    scope.onSort({
                        targetId: scope.targetId,
                        item: evt.model,
                        oldIndex: evt.oldIndex,
                        newIndex: evt.newIndex
                    });
                }
            };
            scope.saveAs = saveAs;
            scope.remove = remove;

            function saveAs() {
                // open modal dialog
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'rameplayer/playlists/save-as-modal.html',
                    controller: 'SaveAsModalController',
                    controllerAs: 'saveAs'
                });

                modalInstance.result.then(function(playlistTitle) {
                    $log.info('Save playlist as', playlistTitle);
                    // server needs only some fields for playlist saving
                    var newPlaylist = {
                        info: {
                            title: playlistTitle
                        },
                        items: []
                    };
                    for (var i = 0; i < $rootScope.lists[scope.targetId].items.length; i++) {
                        newPlaylist.items.push({
                            id: $rootScope.lists[scope.targetId].items[i].id
                        });
                    }
                    $log.info('New playlist', newPlaylist);
                    dataService.createPlaylist(newPlaylist);
                });
            }

            function remove() {
                dataService.removePlaylist(scope.targetId);
            }
        }
    }
})();
