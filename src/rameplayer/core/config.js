(function() {
    'use strict';

    var core = angular.module('rameplayer.core');
    core.config(translation);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.translations('en', {
            Settings: 'Settings',
            Title: 'Title',
            Length: 'Length',
            'Date': 'Date',
            'Selected': 'Selected'
        });
        $translateProvider.translations('fi', {
            Settings: 'Asetukset',
            Title: 'Otsikko',
            Length: 'Pituus',
            'Date': 'Pvm',
            'Selected': 'Valittu'
        });
        $translateProvider.preferredLanguage('en');
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
