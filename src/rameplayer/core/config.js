(function() {
    'use strict';

    var core = angular.module('rameplayer.core');

    core.config(translation);
    core.config(toasters);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.translations('en-US', {
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
            ADMIN_SETTINGS_LINK: 'Admin Settings',
            AUTOPLAY_USB: 'Automatically play files from USB',
            UI_LANGUAGE: 'Language of the user interface',
            DHCP_CLIENT_SETTING: 'Configure networking manually',
            DHCP_SERVER_SETTING: 'Use as DHCP server',
            IP_ADDRESS: 'IP address',
            HOSTNAME: 'Hostname',
            rameAnalogOnly: 'Analog',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Both',
            rameAutodetect: 'Auto',
            rame720p50: '720p 50 Hz',
            rame720p60: '720p 60 Hz',
            rame1080i50: '1080i 50 Hz',
            rame1080i60: '1080i 60 Hz',
            rame1080p50: '1080p 50 Hz',
            rame1080p60: '1080p 60 Hz',
            RESTART_REQUIRED: 'Restart required',
            RESTART_REQUIRED_DESC: 'Some changes need device to be restarted.',
            UPDATE_AVAILABLE: 'Update available',
            UPDATE_AVAILABLE_DESC: 'Newer version of software is available.',
            INCOMPATIBLE_VERSION: 'Incompatible Server Version',
            PLAYLIST_SYNC_REMOVED: 'Playlist $1 is not synchronized to playlist $2 anymore.'
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
            ADMIN_SETTINGS_LINK: 'Järjestelmäasetukset',
            AUTOPLAY_USB: 'Aloita soitto automaattisesti USB-tikulta',
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
            DHCP_CLIENT_SETTING: 'Aseta IP-osoitteet käsin',
            DHCP_SERVER_SETTING: 'Käytä tätä DHCP serverinä',
            IP_ADDRESS: 'IP-osoite',
            HOSTNAME: 'Koneen nimi',
            rameAnalogOnly: 'Analoginen',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Molemmat'
        });
        $translateProvider.preferredLanguage('en-US');
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }

    function toasters(toastrConfig) {
        // Global settings and configurations
        // Toasts thrown from arbitrary exception overrides more settings to make them sticky
        angular.extend(toastrConfig, {
            autoDismiss : false,
            containerId : 'toast-container',
            maxOpened : 0,
            newestOnTop : true,
            positionClass : 'toast-top-right', // toast-bottom-center toast-top-right toast-bottom-full-width
            preventDuplicates : false,
            preventOpenDuplicates : false,
            target : 'body',
        });
    }

})();
