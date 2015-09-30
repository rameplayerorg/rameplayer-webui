(function() {
    'use strict';

    angular
        .module('rameplayer.media')
        .controller('MediaController', ['$http', '$log', '$q', MediaController]);

    function MediaController($http, $log, $q) {
        var vm = this;
    }
})();
