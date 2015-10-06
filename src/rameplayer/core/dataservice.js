(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$http'];

    function dataService($http) {
        var service = {
            getLists: getLists,
            play: play,
            pause: pause
        };

        return service;

        function getLists() {
            return $http.get('stub/lists.json');
        }

        function play(media) {
            return $http.get('player/play');
        }

        function pause() {
            return $http.get('player/pause');
        }
    }
})();
