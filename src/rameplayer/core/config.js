(function() {
    'use strict';

    var core = angular.module('rameplayer.core');

    core.config(translation);
    core.config(toasters);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.translations('en-us', {            
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
            //DHCP_CLIENT_SETTING: 'Configure networking manually',
            //DHCP_SERVER_SETTING: 'Use as DHCP server',
            //IP_ADDRESS: 'IP address',
            //HOSTNAME: 'Hostname',
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
            PLAYLIST_SYNC_REMOVED: 'Playlist $1 is not synchronized to playlist $2 anymore.',
            FIRMWARE_UPGRADED: 'Firmware upgraded',
            FIRMWARE_UPGRADED_DESC: 'Firmware version $1 is now installed.'
        });
        $translateProvider.translations('fi', {
            '': '',
            // settings.html
            'User Settings': 'Käyttäjäasetukset',            
            'Cluster': 'Koneiden klusterointi',
            'Import Configuration': 'Tuo asetukset',
            'Export Configuration': 'Vie asetukset',
            'Units': 'Units',
            'IP address': 'IP-osoite',
            'Port': 'Portti',
            'Play Delay (sec)': 'Soiton viive (sekunteina)',
            'Add': 'Lisää',
            'Hostname': 'Koneen nimi',
            // report-problem-modal.html
            'Add Unit': 'Lisää kone',
            'Report a Problem': 'Raportoi ongelma',
            'Checking Internet connection': 'Varmistetaan Internet-yhteys',
            'Describe the problem': 'Kuvaile ongelma',
            'Email': 'Sähköposti',
            'Include logs': 'Liitä mukaan logitiedosto',
            'Send': 'Lähetä',
            'Cancel': 'Peruuta',
            'Close': 'Sulje',
            'Reporter': 'Lähettäjä',
            'download log': 'lataa logitiedosto',
            'Could not connect to the report server.': 'Palvelimeen ei saatu yhteyttä',
            'Please': 'Ole hyvä,',
            'and send it to support@rameplayer.org and describe the problem in the email message.': 'ja lähetä se sähköpostin liitteenä osoitteeseen support@rameplayer.org sekä lisäksi kuvaile ongelmaa sähköpostiviestissä.',
            // remove-unit-modal.html
            'Are You Sure?': 'Oletko aivan varma?',
            'Do you really want to remove cluster unit': 'Haluatko poistaa tämän koneen klusterista:',
            'Remove': 'Poista',
            // import-cluster-modal.html
            'Import Cluster Configuration': 'Tuo klusteriasetukset',
            'Cluster Configuration File': 'Tiedosto klusteriasetuksista',
            'Select a file containing cluster configuration data and click Import. Note: import will override any existing configuration.': 'Valitse klusteriasetukset sisältävä tiedosto ja hyväksy tuonti. Huomio: asetusten tuonti poistaa aiemmat asetukset.',
            'Import': 'Tuo',
            // cluster-unit.html
            'Hostname unresolved': 'Koneen nimi ei selvillä',
            'Save': 'Tallenna',
            'Edit': 'Muokkaa',
            'Remove unit': 'Poista kone',
            // sync-modal.html
            'Select Playlist To Synchronize With': 'Valitse synkronoitava soittolista',
            'Cluster Unit': 'Kone klusterissa',
            'Playlist': 'Soittolista',
            'Open': 'Avaa',
            // save-as-modal.html
            'Save Playlist As': 'Tallenna soittolista nimellä',
            'Name': 'Nimi',
            'Storage': 'Tallennuspaikka',
            'Playlist name': 'Soittolistan nimi',
            // playlist.html
            'Playlist is empty.': 'Soittolista on tyhjä.',
            'Title': 'Otsikko',
            'Length': 'Kesto',
            'Date': 'Pvm',
            'Default': 'Oletus',
            'Synchronize': 'Synkronoi',
            'Add Stream': 'Lisää syöte',
            'Save as': 'Tallenna nimellä',
            'Move to': 'Siirrä',
            'Lock': 'Lukitse',
            'Clear': 'Tyhjennä',
            'Stop synchronizing this playlist': 'Lakkaa synkronoimasta tätä soittolistaa',
            // edit-modal.html
            'Edit Playlist': 'Muokkaa soittolistaa',
            // add-stream-modal.html
            'Add Network Stream': 'Lisää verkosta tuleva syöte',
            'URL': 'URL-osoite',
            // player.html
            'Stop': 'Stop',
            'Connection error': 'Yhteysvirhe',
            'Connecting...': 'Yhdistetään...',
            'Jump': 'Hyppää',
            'Error: no response': 'Virhe: kone ei vastaa',
            // main.html
            'Playlists': 'Soittolistat',
            // upgrade-firmware-modal.html
            'Upgrade To': 'Päivitä koneen ohjelmisto versioon',
            'Upgrade': 'Päivitä',
            // firmware.html
            'Firmware upgrade': 'Koneen ohjelmistopäivitys',
            'Available firmwares': 'Saatavilla olevat versiot',
            'Latest stable firmware version': 'Viimeisin vakaa ohjelmistoversio',
            'Only development versions available': 'Vain kehitysversioita saatavilla',
            'Current firmware': 'Koneen ohjelmistoversio nyt',
            'Device hardware': 'Koneen kokoonpanoversio',
            // adminsettings.html
            'Admin Settings': 'Järjestelmän asetukset',            
            'Video output resolution': 'Videon resoluutio',
            'Audio port': 'Äänilähtö',
            'Device name': 'Koneen nimi',
            'Device IP': 'Koneen IP-osoite',
            'Subnet mask': 'Aliverkon peite',
            'Gateway IP': 'Gatewayn IP-osoite',
            'DNS, preferred': 'DNS, ensisijainen',
            'DNS, alternative': 'DNS, vaihtoehtoinen',
            'IP Configurations': 'IP-osoiteasetukset',
            'Configure networking manually': 'Aseta IP-osoitteet käsin',
            'Use as DHCP server': 'Käytä konetta DHCP serverinä',
            'Time Configurations': 'Aika-asetukset',
            'Device thinks time is': 'Koneen mielestä kello kulkee',
            'NTP server': 'NTP-palvelin',
            'Use IP address': 'Aseta IP-osoitteella',
            'Configure date and time manually': 'Aseta päivämäärä ja aika käsin',
            'Date:': 'Päivämäärä',
            'Time:': 'Aika:',
            'Factory reset': 'Palauta oletukset',
            '': '',
            '': '',
            '': '',
            '': '',
            '': '',
            '': '',
            '': '',
            
            
            
                        
            VERSION: 'versio',
            INFORMATION:'-tietoja',
            'Software version': 'Ohjelmistoversio',
            'Hardware version': 'Laiteversio',
            'UI version': 'Käyttöliittymäversio',
            SAVE_SETTINGS:'Tallenna asetukset',
            USER_SETTINGS: 'Käyttäjäasetukset',
            SLAVE_DELAY: 'Slave delay, viive sekunteina',
            HDMI_POWERCYCLING: 'HDMI-jakajan uudelleenkäynnistys',
            HDMI_POWERCYCLING_INFO: 'Epäonnistuneen HDMI handshaken varalta.',
            ADMIN_SETTINGS_LINK: 'Järjestelmäasetukset',
            AUTOPLAY_USB: 'Aloita soitto automaattisesti USB-tikulta',
            UI_LANGUAGE: 'Käyttöliittymän kieli',
            
            
            //DHCP_CLIENT_SETTING: 'Aseta IP-osoitteet käsin',
            //DHCP_SERVER_SETTING: 'Käytä tätä DHCP serverinä',
            IP_ADDRESS: 'IP-osoite',
            HOSTNAME: 'Koneen nimi',
            rameAnalogOnly: 'Analoginen',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Molemmat'
        });
        $translateProvider.preferredLanguage('en-us');
        $translateProvider.fallbackLanguage('en-us');
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
