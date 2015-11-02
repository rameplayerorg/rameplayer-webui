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
            'Selected': 'Selected',
            Save: 'Save',
            SAVE_SETTINGS:'Save settings',
            USER_SETTINGS: 'User settings',
            SLAVE_DELAY: 'Slave delay',
            HDMI_POWERCYCLING: 'Internal powercycle of HDMI-splitter',
            HDMI_POWERCYCLING_INFO: 'Workaround for failed HDMI handshake.',
            RESET_HDMI: 'Reset HDMI interface',
            UI_LANGUAGE: 'Language of the user interface',
            'Device IP': 'Device IP',
            'Subnet mask': 'Subnet mask',
            'Gateway IP': 'Gateway IP',
        });
        $translateProvider.translations('fi', {
            Settings: 'Asetukset',
            Filename: 'Tiedosto',
            Title: 'Otsikko',
            Length: 'Pituus',
            'Date': 'Pvm',
            'Selected': 'Valittu',
            Save: 'Tallenna',
            SAVE_SETTINGS:'Tallenna asetukset',
            USER_SETTINGS: 'Käyttäjäasetukset',
            SLAVE_DELAY: 'Slave delay',
            HDMI_POWERCYCLING: 'HDMI-jakajan uudelleenkäynnistys',
            HDMI_POWERCYCLING_INFO: 'Workaround for failed HDMI handshake.',
            RESET_HDMI: 'Uudelleenkäynnistä HDMI',
            UI_LANGUAGE: 'Käyttöliittymän kieli',            
            'Device IP': 'Koneen IP-osoite',
            'Subnet mask': 'Aliverkon peite',
            'Gateway IP': 'Gatewayn IP-osoite',
        });
        $translateProvider.preferredLanguage(settings.language);
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
