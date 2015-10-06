(function() {
    'use strict';

    var core = angular.module('rameplayer.core');
    core.config(translation);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.translations('en', {
            Title: 'Title',
            Duration: 'Duration',
            'Date': 'Date'
        });
        $translateProvider.translations('fi', {
            Title: 'Otsikko',
            Duration: 'Kesto',
            'Date': 'Pvm'
        });
        $translateProvider.preferredLanguage('en');
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
