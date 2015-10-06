(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$http'];

    function dataService($http) {
        var urlPrefix = 'stubs';

        var service = {
            getLists: getLists,
            play: play,
            pause: pause
        };

        return service;

        function getLists() {
            return $http.get(urlPrefix + '/lists.json');
        }

        function play(media) {
            return $http.get(urlPrefix + '/player/play');
        }

        function pause() {
            return $http.get(urlPrefix + '/player/pause');
        }
    }
})();
