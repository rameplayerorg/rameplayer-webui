(function() {
    'use strict';

    var core = angular.module('rameplayer.core');

    core.config(routes);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'rameplayer/main/main.html'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'rameplayer/admin/admin.html'
            });
    }
})();
