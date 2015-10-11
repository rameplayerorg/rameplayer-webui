(function() {
    'use strict';

    var core = angular.module('rameplayer.core');
    core.config(translation);

    translation.$inject = ['$translateProvider', 'settings'];

    function translation($translateProvider, settings) {
        $translateProvider.translations('en', {
            Settings: 'Settings',
            Filename: 'Filename',
            Title: 'Title',
            Length: 'Length',
            'Date': 'Date',
            'Selected': 'Selected'
        });
        $translateProvider.translations('fi', {
            Settings: 'Asetukset',
            Filename: 'Tiedosto',
            Title: 'Otsikko',
            Length: 'Pituus',
            'Date': 'Pvm',
            'Selected': 'Valittu'
        });
        $translateProvider.preferredLanguage(settings.language);
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
