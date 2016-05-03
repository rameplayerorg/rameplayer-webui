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
            // playlist.html
            'Default': 'Work list',

            // admin.js
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
            DEVICE_HOSTNAME: 'Device hostname',
            DEVICE_IP: 'Device IP',
            SUBNET_MASK: 'Subnet mask',
            GATEWAY_IP: 'Gateway IP',
            DNS_FIRST: 'DNS, preferred',
            DNS_SECOND: 'DNS, alternative',
            DHCP_RANGE_START: 'DHCP range start',
            DHCP_RANGE_END: 'DHCP range end',
            DHCP_RANGE_DEF: 'DHCP range definition',
            MANUAL_DATE: 'Manual date',
            MANUAL_TIME: 'Manual time',
            NTP_SERVER_HOSTNAME: 'NTP server hostname',
            ADMIN_SETTINGS_NOT_SAVED: 'Admin settings not saved.',
            CHECK_INSERTED_VALUES: 'Check inserted values',
            INVALID_OPTIONAL_SETTINGS: 'Optional settings with invalid values',
            // dataservice-provider.js
            INCOMPATIBLE_VERSION: 'Incompatible Server Version',
            FIRMWARE_UPGRADED: 'Firmware upgraded',
            FIRMWARE_UPGRADED_DESC: 'Firmware version $1 is now installed.',
            // playlist.directive.js
            PLAYLIST_SYNC_REMOVED: 'Playlist $1 is not synchronized to playlist $2 anymore.',
            // statusservice.js
            CONNECTION_ERROR: 'Connection error',
            CONNECTION_ERROR_DESC: 'Connection failed to device at $1.',
            RESTART_REQUIRED: 'Restart required',
            RESTART_REQUIRED_DESC: 'Some changes need device to be restarted. Open main player page after reboot.',
            UPDATE_AVAILABLE: 'Update available',
            UPDATE_AVAILABLE_DESC: 'Newer version of software is available.',
            // report-problem.js
            REPORT_NOT_SENT: 'Report not sent',
            SENDING_REPORT_FAILED_DESC: 'Sending report failed.',
            LOADING_LOGS_FAILED_DESC: 'Could not load logs from server.',
            LOADING_LOGS_ERROR: 'Error loading logs',
            REPORT_SENT: 'Report sent',
            REPORT_SENT_SUCCESS_DESC: 'Thank you for sending the report!',
            // import-cluster-modal.js
            CLUSTER_CONFIG_IMPORTED: 'Cluster Configuration Imported',
            CLUSTER_CONFIG_IMPORTED_SUCCESS_DESC: 'Cluster configuration imported successfully.',
            //cluster-unit.directive.js
            CLUSTER: 'Cluster',
            UNIT_SETTINGS_UPDATED_DESC: 'Unit settings updated.',
            UNIT_REMOVED_DESC: 'Unit removed.',
            IP_ADDRESS_INVALID_DESC: 'IP address is invalid.', 
            CLUSTER_UNIT_SETTINGS: 'Cluster Unit Settings',
            // settings.js
            OPTION_SAVED: 'Option saved',
            OPTION_AUTOPLAY_USB_DESC: 'Option Autoplay USB',
            OPTION_ENABLED: 'enabled',
            OPTION_DISABLED: 'disabled',
            OPTION_SAVE_FAILED: 'Option saving failed',
            OPTION_AUTOPLAY_USB_FAILED_DESC: 'Option Autoplay USB saving failed.',
            LANGUAGE_SAVED: 'Language saved.',
            INVALID_CLUSTER_SETTINGS_DESC: 'IP address of new unit',
            INVALID_SETTINGS: 'Invalid settings',
            NEW_ADDED:'Added new',
            NEW_CLUSTER_UNIT_ADDED_DESC: 'New cluster unit added.',
            headphone: 'Headphone',
            lineout: 'Line out',
            // cluster-service.js
            CLUSTER_UNIT_OFFLINE: 'Cluster unit disconnected',
            CLUSTER_UNIT_OFFLINE_DESC: 'Connection lost to cluster unit $1.',
        });
        $translateProvider.translations('fi', {
            //'': '',
            // settings.html
            'User Settings': 'Käyttäjäasetukset',
            'Automatically play files from USB': 'Aloita soitto automaattisesti USB-tikulta',
            'Language of the user interface': 'Käyttöliittymän kieli',
            'Cluster': 'Laitteiden klusterointi',
            'Import Configuration': 'Tuo asetukset',
            'Export Configuration': 'Vie asetukset',
            'Units': 'Units',
            'IP address': 'IP-osoite',
            'Port': 'Portti',
            'Play Delay (sec)': 'Soiton viive (sek)',
            'Add': 'Lisää',
            'Hostname': 'Laitteen nimi',
            INFORMATION:'-tietoja',
            'Firmware version': 'Laiteohjelmisto (Firmware)',
            'Hardware version': 'Laitteisto',
            // media-item.html
            'Add to Work list': 'Lisää koontilistaan',
            'Remove': 'Poista',
            'Move to': 'Siirrä',
            // report-problem-modal.html
            'Add Unit': 'Lisää laite',
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
            'and send it to support@rameplayer.org and describe the problem in the email message.': // jshint ignore:line
                'ja lähetä se sähköpostin liitteenä osoitteeseen support@rameplayer.org sekä lisäksi kuvaile ongelmaa sähköpostiviestissä.', // jshint ignore:line
            // remove-unit-modal.html
            'Are You Sure?': 'Oletko aivan varma?',
            'Do you really want to remove cluster unit': 'Haluatko poistaa tämän laitteen klusterista:',
            // import-cluster-modal.html
            'Import Cluster Configuration': 'Tuo klusteriasetukset',
            'Cluster Configuration File': 'Tiedosto klusteriasetuksista',
            'Select a file containing cluster configuration data and click Import. Note: import will override any existing configuration.': // jshint ignore:line
                'Valitse klusteriasetukset sisältävä tiedosto ja hyväksy tuonti. Huomio: asetusten tuonti poistaa aiemmat asetukset.', // jshint ignore:line
            'Import': 'Tuo',
            // cluster-unit.html
            'Hostname unresolved': 'Laitteen nimi ei selvillä',
            'Save': 'Tallenna',
            'Edit': 'Muokkaa',
            'Remove unit': 'Poista laite',
            // sync-modal.html
            'Select Playlist To Synchronize With': 'Valitse synkronoitava soittolista',
            'Cluster Unit': 'Laite klusterissa',
            'Playlist': 'Soittolista',
            'Open': 'Avaa',
            // save-as-modal.html
            'Save Playlist As': 'Tallenna soittolista nimellä',
            'Save Playlist': 'Tallenna soittolista',
            'Name': 'Nimi',
            'Storage': 'Tallennuspaikka',
            'Playlist name': 'Soittolistan nimi',
            // playlist.html
            'Playlist is empty.': 'Soittolista on tyhjä.',
            'Title': 'Otsikko',
            'Length': 'Kesto',
            'Date': 'Pvm',
            'Default': 'Koontilista',
            'Synchronize': 'Synkronoi',
            'Add Stream': 'Lisää syöte',
            'Save as': 'Tallenna nimellä',
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
            'Error: no response': 'Virhe: laite ei vastaa',
            // main.html
            'Playlists': 'Soittolistat',
            // upgrade-firmware-modal.html
            'Upgrade To': 'Päivitä laitteen ohjelmisto versioon',
            'Upgrade': 'Päivitä',
            // firmware.html
            'Firmware upgrade': 'Laitteen ohjelmistopäivitys',
            'Available firmwares': 'Saatavilla olevat versiot',
            'Latest stable firmware version': 'Viimeisin vakaa ohjelmistoversio',
            'Only development versions available': 'Vain kehitysversioita saatavilla',
            'Current firmware': 'Laitteen ohjelmistoversio nyt',
            'Device hardware': 'Laitteen kokoonpanoversio',
            // adminsettings.html
            'Admin Settings': 'Järjestelmäasetukset',
            'Video output resolution': 'Videon resoluutio',
            'Audio port': 'Äänilähtö',
            'HDMI and analog audio outputs are not synchronized with each other': 'HDMI- ja analoginen äänilähtö eivät ole keskenään synkronoituja', // jshint ignore:line
            rameAnalogOnly: 'Analoginen',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Molemmat',
            'Device name': 'Laitteen nimi',
            'Device IP': 'Laitteen IP-osoite',
            'Subnet mask': 'Aliverkon peite',
            'Gateway IP': 'Gatewayn IP-osoite',
            'DNS, preferred': 'DNS, ensisijainen',
            'DNS, alternative': 'DNS, vaihtoehtoinen',
            'IP Configurations': 'IP-osoiteasetukset',
            'Configure networking manually': 'Aseta IP-osoitteet käsin',
            'Use as DHCP server': 'Käytä laitetta DHCP serverinä',
            'DHCP range start': 'DHCP arvojen alku',
            'DHCP range end': 'DHCP arvojen loppu',
            'Time Configurations': 'Aika-asetukset',
            'Device time': 'Laitteen aika',
            'NTP server': 'NTP-palvelin',
            'Use IP address': 'Aseta IP-osoitteella',
            'Configure date and time manually': 'Aseta päivämäärä ja aika käsin',
            'Date:': 'Päivämäärä:',
            'Time:': 'Kellonaika:',
            'Factory reset': 'Palauta oletukset',
            // admin.js
            DEVICE_HOSTNAME: 'Laitteen nimi',
            DEVICE_IP: 'Laitteen IP-osoite',
            SUBNET_MASK: 'Aliverkon peite',
            GATEWAY_IP: 'Gatewayn IP-osoite',
            DNS_FIRST: 'DNS, ensisijainen',
            DNS_SECOND: 'DNS, vaihtoehtoinen',
            DHCP_RANGE_START: 'DHCP arvoalueen alku',
            DHCP_RANGE_END: 'DHCP arvoalueen loppu',
            DHCP_RANGE_DEF: 'DHCP arvoalueet',
            MANUAL_DATE: 'Annettu päivämäärä',
            MANUAL_TIME: 'Annettu aika',
            NTP_SERVER_HOSTNAME: 'NTP-palvelimen nimi',
            ADMIN_SETTINGS_NOT_SAVED: 'Järjestelmäasetuksia ei tallennettu.',
            CHECK_INSERTED_VALUES: 'Tarkista syötetyt arvot',
            INVALID_OPTIONAL_SETTINGS: 'Valinnaisissa asetuksissa epäkelpoja arvoja',
            // settings.js
            OPTION_SAVED: 'Valinta tallennettu',
            OPTION_AUTOPLAY_USB_DESC: 'Automaattinen soitto USB-tikulta',
            OPTION_ENABLED: 'päällä',
            OPTION_DISABLED: 'pois päältä',
            OPTION_SAVE_FAILED: 'Valinnan tallennus epäonnistui',
            OPTION_AUTOPLAY_USB_FAILED_DESC: 'Automaattinen soitto USB-tikulta',
            LANGUAGE_SAVED: 'Kielivalinta tallennettu',
            INVALID_CLUSTER_SETTINGS_DESC: 'Lisätyn laitteen IP-osoite ei kelpaa.',
            INVALID_SETTINGS: 'Tarkista asetus',
            NEW_ADDED:'Lisätty uusi',
            NEW_CLUSTER_UNIT_ADDED_DESC: 'Uusi laite lisätty klusteriin.',
            // dataservice-provider.js
            FIRMWARE_UPGRADED: 'Ohjelmisto päivitetty',
            FIRMWARE_UPGRADED_DESC: 'Ohjelmistoversio $1 on nyt päivitetty laitteeseen.',
            INCOMPATIBLE_VERSION: 'Palvelimen versio epäyhteensopiva',
            // statusservice.js
            CONNECTION_ERROR: 'Yhteysvirhe',
            CONNECTION_ERROR_DESC: 'Ei yhteyttä laitteeseen osoitteessa $1.',
            RESTART_REQUIRED: 'Uudelleenkäynnistys tarvitaan',
            RESTART_REQUIRED_DESC: 'Jotkin muutoksista vaativat laitteen uudelleenkäynnistystä. Palaa sen jälkeen aloitussivulle.', // jshint ignore:line
            UPDATE_AVAILABLE: 'Päivitys saatavilla',
            UPDATE_AVAILABLE_DESC: 'Uudempi ohjelmistoversio laitteeseen on saatavilla.',
            // playlist.directive.js
            PLAYLIST_SYNC_REMOVED: 'Soittolistat $1 ja $2 eivät ole enää synkronoituna.',
            //cluster-unit.directive.js
            CLUSTER: 'Klusteri',
            UNIT_SETTINGS_UPDATED_DESC: 'Klusterin laitteen asetukset päivitetty.',
            UNIT_REMOVED_DESC: 'Laite poistettu klusterista.',
            IP_ADDRESS_INVALID_DESC: 'IP-osoite ei kelpaa.', 
            CLUSTER_UNIT_SETTINGS: 'Klusterilaiteasetus',
            // upgrade-firmware-modal.js
            FIRMWARE_UPGRADE_FAILED_DESC: 'Firmware upgrade failed to ',
            UPGRADE_FAILED: 'Upgrade Failed',
            // report-problem.js
            REPORT_NOT_SENT: 'Raporttia ei lähetetty',
            SENDING_REPORT_FAILED_DESC: 'Raportin lähettäminen epäonnistui.',
            LOADING_LOGS_FAILED_DESC: 'Logitiedostoa ei voitu ladata palvelimelta.',
            LOADING_LOGS_ERROR: 'Virhe logien lataamisessa',
            REPORT_SENT: 'Raportti lähetetty',
            REPORT_SENT_SUCCESS_DESC: 'Kiitos raportoinnista!',
            // import-cluster-modal.js
            CLUSTER_CONFIG_IMPORTED: 'Klusteriasetukset tuotu',
            CLUSTER_CONFIG_IMPORTED_SUCCESS_DESC: 'Klusteriasetusten tuonti onnistui.',
            // rame-version-details.html 
            //Translations for info fields not used 
            //for sake of consistency in debugging
            'Backend version': 'Taustaohjelmisto (Backend)',
            'Hardware add-on info': 'Laitteen lisäosatieto (Hw add-on)',
            'Hardware config': 'Laitteen kokoonpano (Hw cfg)',
            'Web UI version': 'Käyttöliittymä (Web UI)',
            'Details': 'Lisätietoja',
            'Software version': 'Ohjelmistoversio',
            'UI version': 'Käyttöliittymä',
            // volumes.html
            'Volumes': 'Äänenvoimakkuudet',
            'Volume settings are unavailable when audio out is set to:': 'Äänenvoimakkuuden säätö ei ole mahdollista kun äänilähdöksi on määritelty:', // jshint ignore:line
            // volume-control.html
            headphone: 'Kuulokkeet',
            lineout: 'Linjalähtö',
            // cluster-service.js
            CLUSTER_UNIT_OFFLINE: 'Ei yhteyttä klusteriyksikköön',
            CLUSTER_UNIT_OFFLINE_DESC: 'Yhteys katkesi klusteriyksikköön $1.',
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
            allowHtml : true,
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
