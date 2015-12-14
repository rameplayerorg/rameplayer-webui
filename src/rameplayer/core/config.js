(function() {
    'use strict';

    var core = angular.module('rameplayer.core');
    core.config(translation);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.translations('en', {
            Settings: 'Settings',
            Name: 'Name',
            Filename: 'Filename',
            Title: 'Title',
            Length: 'Length',
            'Date': 'Date',
            'Selected': 'Selected',
            Save: 'Save',
            VERSION: 'Version',
            INFORMATION: 'Information',
            SOFTWARE_VERSION: 'Software version',
            HARDWARE_VERSION: 'Hardware version',
            UI_VERSION: 'UI version',
            SAVE_SETTINGS:'Save settings',
            USER_SETTINGS: 'User settings',
            SLAVE_DELAY: 'Slave delay in seconds',
            HDMI_POWERCYCLING: 'Internal powercycle of HDMI-splitter',
            HDMI_POWERCYCLING_INFO: 'Workaround for failed HDMI handshake.',
            RESET_HDMI: 'Reset HDMI interface',
            UI_LANGUAGE: 'Language of the user interface',
            DHCP_CLIENT_SETTING: 'Obtain IP automatically as DHCP client'
        });
        $translateProvider.translations('fi', {
            Settings: 'Asetukset',
            Name: 'Nimi',
            Filename: 'Tiedosto',
            Title: 'Otsikko',
            Length: 'Kesto',
            'Date': 'Pvm',
            'Selected': 'Valittu',
            Save: 'Tallenna',
            VERSION: 'versio',
            INFORMATION:'-tietoja',
            SOFTWARE_VERSION: 'Ohjelmistoversio',
            HARDWARE_VERSION: 'Laiteversio',
            UI_VERSION: 'UI-versio',
            SAVE_SETTINGS:'Tallenna asetukset',
            USER_SETTINGS: 'Käyttäjäasetukset',
            SLAVE_DELAY: 'Slave delay, viive sekunteina',
            HDMI_POWERCYCLING: 'HDMI-jakajan uudelleenkäynnistys',
            HDMI_POWERCYCLING_INFO: 'Epäonnistuneen HDMI handshaken varalta.',
            RESET_HDMI: 'Uudelleenkäynnistä HDMI',
            UI_LANGUAGE: 'Käyttöliittymän kieli',
            'Audio port': 'Audio-porttivalinta',
            'Video output resolution': 'Videon resoluutio',
            'Device name': 'Koneen nimi',
            'Device IP': 'Koneen IP-osoite',
            'Subnet mask': 'Aliverkon peite',
            'Gateway IP': 'Gatewayn IP-osoite',
            'DNS, preferred': 'DNS, ensisijainen',
            'DNS, alternative': 'DNS, vaihtoehtoinen',
            'Admin Settings': 'Järjestelmän asetukset',
            'IP Configurations': 'IP-osoitteet',
            DHCP_CLIENT_SETTING: 'Hae IP-osoitteet automaattisesti DHCP:n kautta'
        });
        $translateProvider.preferredLanguage('en');
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
