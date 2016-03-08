(function() {
    'use strict';

    angular.module('rameplayer.core', [
        'ui.router',
        'filereader',
        // angular translate
        'pascalprecht.translate',
        'ngFileSaver',
        'ngSanitize',
        'ngResource',
        'ng-sortable',
        'angular-uuid-generator',
        'ngStorage'
    ]);
})();
