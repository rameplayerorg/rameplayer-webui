(function() {
    'use strict';

    var core = angular.module('rameplayer.core');

    core.config(translation);
    core.config(toasters);

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        /*jshint camelcase: false */
        $translateProvider.translations('en-us', {
            VERSION: 'Version',
            HELP_LINK: '/help/en-us/',
            INFORMATION: 'Information',
            // playlist.html
            'Default': 'Work list',
            // admin.js
            rameAnalogOnly: 'Analog',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Both',
            rameAutodetect: 'Auto',
            rame720p50: '720p 50 Hz', // old, remove this later
            rame720p60: '720p 60 Hz', // old, remove this later
            rame1080i50: '1080i 50 Hz', // old, remove this later
            rame1080i60: '1080i 60 Hz', // old, remove this later
            rame1080p50: '1080p 50 Hz', // old, remove this later
            rame1080p60: '1080p 60 Hz', // old, remove this later
            rameCEA1_VGA640x480: 'HDMI CEA 640x480 (VGA)',
            rameCEA2_480p60: 'HDMI CEA 480p 60 Hz (4:3)',
            rameCEA3_480p60w: 'HDMI CEA 480p 60 Hz (16:9)',
            rameCEA4_720p60: 'HDMI CEA 720p 60 Hz',
            rameCEA5_1080i60: 'HDMI CEA 1080i 60 Hz',
            rameCEA6_480i60: 'HDMI CEA 480i 60 Hz (4:3)',
            rameCEA7_480i60w: 'HDMI CEA 480i 60 Hz (16:9)',
            rameCEA8_240p60: 'HDMI CEA 240p 60 Hz (4:3)',
            rameCEA9_240p60w: 'HDMI CEA 240p 60 Hz (16:9)',
            rameCEA10_480i60pq: 'HDMI CEA 480i 60 Hz (4x, 4:3)',
            rameCEA11_480i60pqw: 'HDMI CEA 480i 60 Hz (4x, 16:9)',
            rameCEA12_240p60pq: 'HDMI CEA 240p 60 Hz (4x, 4:3)',
            rameCEA13_240p60pqw: 'HDMI CEA 240p 60 Hz (4x, 16:9)',
            rameCEA14_480p60pd: 'HDMI CEA 480p 60 Hz (2x 4:3)',
            rameCEA15_480p60pdw: 'HDMI CEA 480p 60 Hz (2x, 16:9)',
            rameCEA16_1080p60: 'HDMI CEA 1080p 60 Hz',
            rameCEA17_576p50: 'HDMI CEA 576p 50 Hz (4:3)',
            rameCEA18_576p50w: 'HDMI CEA 576p 50 Hz (16:9)',
            rameCEA19_720p50: 'HDMI CEA 720p 50 Hz',
            rameCEA20_1080i50: 'HDMI CEA 1080i 50 Hz',
            rameCEA21_576i50: 'HDMI CEA 576i 50 Hz (4:3)',
            rameCEA22_576i50w: 'HDMI CEA 576i 50 Hz (16:9)',
            rameCEA23_288p50: 'HDMI CEA 288p 50 Hz (4:3)',
            rameCEA24_288p50w: 'HDMI CEA 288p 50 Hz (16:9)',
            rameCEA25_576i50pq: 'HDMI CEA 576i 50 Hz (4x, 4:3)',
            rameCEA26_576i50pqw: 'HDMI CEA 576i 50 Hz (4x, 16:9)',
            rameCEA27_288p50pq: 'HDMI CEA 288p 50 Hz (4x, 4:3)',
            rameCEA28_288p50pqw: 'HDMI CEA 288p 50 Hz (4x, 16:9)',
            rameCEA29_576p50pd: 'HDMI CEA 576p 50 Hz (2x, 4:3)',
            rameCEA30_576p50pdw: 'HDMI CEA 576p 50 Hz (2x, 16:9)',
            rameCEA31_1080p50: 'HDMI CEA 1080p 50 Hz',
            rameCEA32_1080p24: 'HDMI CEA 1080p 24 Hz',
            rameCEA33_1080p25: 'HDMI CEA 1080p 25 Hz',
            rameCEA34_1080p30: 'HDMI CEA 1080p 30 Hz',
            rameCEA35_480p60pq: 'HDMI CEA 480p 60 Hz (4x, 4:3)',
            rameCEA36_480p60pqw: 'HDMI CEA 480p 60 Hz (4x, 16:9)',
            rameCEA37_576p50pq: 'HDMI CEA 576p 50 Hz (4x, 4:3)',
            rameCEA38_576p50pqw: 'HDMI CEA 576p 50 Hz (4x, 16:9)',
            rameCEA39_1080i50rb: 'HDMI CEA 1080i 50 Hz (reduced blanking)',
            rameCEA40_1080i100: 'HDMI CEA 1080i 100 Hz',
            rameCEA41_720p100: 'HDMI CEA 720p 100 Hz',
            rameCEA42_576p100: 'HDMI CEA 576p 100 Hz (4:3)',
            rameCEA43_576p100w: 'HDMI CEA 576p 100 Hz (16:9)',
            rameCEA44_576i100: 'HDMI CEA 576i 100 Hz (4:3)',
            rameCEA45_576i100w: 'HDMI CEA 576i 100 Hz (16:9)',
            rameCEA46_1080i120: 'HDMI CEA 1080i 120 Hz',
            rameCEA47_720p120: 'HDMI CEA 720p 120 Hz',
            rameCEA48_480p120: 'HDMI CEA 480p 120 Hz (4:3)',
            rameCEA49_480p120w: 'HDMI CEA 480p 120 Hz (16:9)',
            rameCEA50_480i120: 'HDMI CEA 480i 120 Hz (4:3)',
            rameCEA51_480i120w: 'HDMI CEA 480i 120 Hz (16:9)',
            rameCEA52_576p200: 'HDMI CEA 576p 200 Hz (4:3)',
            rameCEA53_576p200w: 'HDMI CEA 576p 200 Hz (16:9)',
            rameCEA54_576i200: 'HDMI CEA 576i 200 Hz (4:3)',
            rameCEA55_576i200w: 'HDMI CEA 576i 200 Hz (16:9)',
            rameCEA56_480p240: 'HDMI CEA 480p 240 Hz (4:3)',
            rameCEA57_480p240w: 'HDMI CEA 480p 240 Hz (16:9)',
            rameCEA58_480i240: 'HDMI CEA 480i 240 Hz (4:3)',
            rameCEA59_480i240w: 'HDMI CEA 480i 240 Hz (16:9)',
            // note: DMT modes 34,38,45,50,53-56,59-67,69-80,84 go over RPi pixel clock limit
            rameDMT1_640x350x85: 'HDMI DMT 640x350 85 Hz',
            rameDMT2_640x400x85: 'HDMI DMT 640x400 85 Hz',
            rameDMT3_720x400x85: 'HDMI DMT 720x400 85 Hz',
            rameDMT4_640x480x60: 'HDMI DMT 640x480 60 Hz',
            rameDMT5_640x480x72: 'HDMI DMT 640x480 72 Hz',
            rameDMT6_640x480x75: 'HDMI DMT 640x480 75 Hz',
            rameDMT7_640x480x85: 'HDMI DMT 640x480 85 Hz',
            rameDMT8_800x600x56: 'HDMI DMT 800x600 56 Hz',
            rameDMT9_800x600x60: 'HDMI DMT 800x600 60 Hz',
            rameDMT10_800x600x72: 'HDMI DMT 800x600 72 Hz',
            rameDMT11_800x600x75: 'HDMI DMT 800x600 75 Hz',
            rameDMT12_800x600x85: 'HDMI DMT 800x600 85 Hz',
            rameDMT13_800x600x120: 'HDMI DMT 800x600 120 Hz',
            rameDMT14_848x480x60: 'HDMI DMT 848x480 60 Hz',
            // note: DMT mode 15 is not RPi compatible
            rameDMT16_1024x768x60: 'HDMI DMT 1024x768 60 Hz',
            rameDMT17_1024x768x70: 'HDMI DMT 1024x768 70 Hz',
            rameDMT18_1024x768x75: 'HDMI DMT 1024x768 75 Hz',
            rameDMT19_1024x768x85: 'HDMI DMT 1024x768 85 Hz',
            rameDMT20_1024x768x120: 'HDMI DMT 1024x768 120 Hz',
            rameDMT21_1152x864x75: 'HDMI DMT 1152x864 75 Hz',
            rameDMT22_1280x768rb: 'HDMI DMT 1280x768 (reduced blanking)',
            rameDMT23_1280x768x60: 'HDMI DMT 1280x768 60 Hz',
            rameDMT24_1280x768x75: 'HDMI DMT 1280x768 75 Hz',
            rameDMT25_1280x768x85: 'HDMI DMT 1280x768 85 Hz',
            rameDMT26_1280x768x120rb: 'HDMI DMT 1280x768 120 Hz (reduced blanking)',
            rameDMT27_1280x800rb: 'HDMI DMT 1280x800 (reduced blanking)',
            rameDMT28_1280x800x60: 'HDMI DMT 1280x800 60 Hz',
            rameDMT29_1280x800x75: 'HDMI DMT 1280x800 75 Hz',
            rameDMT30_1280x800x85: 'HDMI DMT 1280x800 85 Hz',
            rameDMT31_1280x800x120rb: 'HDMI DMT 1280x800 120 Hz (reduced blanking)',
            rameDMT32_1280x960x60: 'HDMI DMT 1280x960 60 Hz',
            rameDMT33_1280x960x85: 'HDMI DMT 1280x960 85 Hz',
            rameDMT35_1280x1024x60: 'HDMI DMT 1280x1024 60 Hz',
            rameDMT36_1280x1024x75: 'HDMI DMT 1280x1024 75 Hz',
            rameDMT37_1280x1024x85: 'HDMI DMT 1280x1024 85 Hz',
            rameDMT39_1360x768x60: 'HDMI DMT 1360x768 60 Hz',
            rameDMT40_1360x768x120rb: 'HDMI DMT 1360x768 120 Hz (reduced blanking)',
            rameDMT41_1400x1050rb: 'HDMI DMT 1400x1050 (reduced blanking)',
            rameDMT42_1400x1050x60: 'HDMI DMT 1400x1050 60 Hz',
            rameDMT43_1400x1050x75: 'HDMI DMT 1400x1050 75 Hz',
            rameDMT44_1400x1050x85: 'HDMI DMT 1400x1050 85 Hz',
            rameDMT46_1440x900rb: 'HDMI DMT 1440x900 (reduced blanking)',
            rameDMT47_1440x900x60: 'HDMI DMT 1440x900 60 Hz',
            rameDMT48_1440x900x75: 'HDMI DMT 1440x900 75 Hz',
            rameDMT49_1440x900x85: 'HDMI DMT 1440x900 85 Hz',
            rameDMT51_1600x1200x60: 'HDMI DMT 1600x1200 60 Hz',
            rameDMT52_1600x1200x65: 'HDMI DMT 1600x1200 65 Hz',
            rameDMT57_1680x1050rb: 'HDMI DMT 1680x1050 (reduced blanking)',
            rameDMT58_1680x1050x60: 'HDMI DMT 1680x1050 60 Hz',
            rameDMT68_1920x1200rb: 'HDMI DMT 1920x1200 (reduced blanking)',
            rameDMT81_1366x768x60: 'HDMI DMT 1366x768 60 Hz',
            rameDMT82_1920x1080x60: 'HDMI DMT 1920x1080 (1080p) 60 Hz',
            rameDMT83_1600x900rb: 'HDMI DMT 1600x900 (reduced blanking)',
            rameDMT85_1280x720x60: 'HDMI DMT 1280x720 (720p) 60 Hz',
            rameDMT86_1366x768rb: 'HDMI DMT 1366x768 (reduced blanking)',
            rameDMT87_custom: 'HDMI DMT Custom', // put hdmi_timings to SD card user/config.txt
            rameAnalogPAL: 'SDTV Analog PAL',
            rameAnalogPALBrazil: 'SDTV Analog PAL, Brazilian',
            rameAnalogPALProgressive: 'SDTV Analog PAL, progressive scan',
            rameAnalogNTSC: 'SDTV Analog NTSC',
            rameAnalogNTSCJapan: 'SDTV Analog NTSC, Japanese',
            rameAnalogNTSCProgressive: 'SDTV Analog NTSC, progressive scan',
            //
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
            NTP_SERVER_HOSTNAME: 'NTP server hostnames',
            ADMIN_SETTINGS_NOT_SAVED: 'Admin settings not saved.',
            CHECK_INSERTED_VALUES: 'Check inserted values',
            INVALID_OPTIONAL_SETTINGS: 'Optional settings might have invalid values',
            // dataservice-provider.js
            INCOMPATIBLE_VERSION: 'Incompatible Server Version',
            FIRMWARE_UPGRADED: 'Firmware upgraded',
            FIRMWARE_UPGRADED_DESC: 'Firmware version $1 is now installed.',
            MEDIA_SAFELY_REMOVED: 'Media removed safely. ($1)',
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
            // recorder.component.js
            STREAMING_STARTED: 'Streaming service started',
            STREAMING_STOPPED: 'Streaming service stopped',
            RECORDING_STARTED: 'Recording started',
            RECORDING_STOPPED: 'Recording stopped',
            RECORDING_AND_STREAMING_STARTED: 'Streaming service and recording started',
            RECORDING_AND_STREAMING_STOPPED: 'Streaming service and recording stopped',
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
            // media-list.html
            'Add Directory To Work list': 'Lisää hakemisto koontilistaan',
            'Upload Files…': 'Lataa tiedostoja kansioon…',
            'Safely Remove USB Drive': 'Poista USB-asema turvallisesti',
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
            'Playlist with this name exists already. This playlist will overwrite existing one!': 'Soittolistan nimi on jo käytössä. Tämä lista ylikirjoittaa olemassaolevan listan!', // jshint ignore:line
            'Play this when device starts': 'Soita tämä lista kun laite käynnistyy',
            'Continuous play, repeating all': 'Soita peräkkäin ja toista alusta',
            'Randomize continuous play order': 'Soita peräkkäin satunnaisessa järjestyksessä',
            'Start playing this list on scheduled time and day of week': 'Aloita listan soitto ajastettuna kellonaikana ja viikonpäivänä', // jshint ignore:line
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
            'Edit Properties': 'Muokkaa ominaisuuksia',
            'Stop synchronizing this playlist': 'Lakkaa synkronoimasta tätä soittolistaa',
            'Mon': 'Ma',
            'Tue': 'Ti',
            'Wed': 'Ke',
            'Thu': 'To',
            'Fri': 'Pe',
            'Sat': 'La',
            'Sun': 'Su',
            // edit-modal.html
            'Edit Playlist Properties': 'Muokkaa soittolistan ominaisuuksia',
            // add-stream-modal.html
            'Add Network Stream': 'Lisää verkosta tuleva syöte',
            'URL': 'URL-osoite',
            // player.html
            'Stop': 'Stop',
            'Play on repeat': 'Soita toistuvasti',
            'Connection error': 'Yhteysvirhe',
            'Connecting...': 'Yhdistetään...',
            'Jump': 'Hyppää',
            'Error: no response': 'Virhe: laite ei vastaa',
            // main.html
            'Playlists': 'Soittolistat',
            'Help': 'Ohje',
            // upgrade-firmware-modal.html
            'Upgrade To': 'Päivitä laitteen ohjelmisto versioon',
            'Upgrade': 'Päivitä',
            // restart-modal.html
            'Restart': 'Käynnistä uudelleen',
            // factory-reset-modal.html
            'You will lose all your customized settings! Device will be restarted.': 'Menetät kaikki muokkaamasi asetukset! Laite käynnistetään uudelleen.', // jshint ignore:line
            // firmware.html
            'Firmware upgrade': 'Laitteen ohjelmistopäivitys',
            'Available firmwares': 'Saatavilla olevat versiot',
            'Latest stable firmware version': 'Viimeisin vakaa ohjelmistoversio',
            'Could not load list of firmwares available for upgrade.': 'Listaa saatavilla olevista ohjelmistoversioista ei voitu ladata.', // jshint ignore:line
            'Only development versions available': 'Vain kehitysversioita saatavilla',
            'Current firmware': 'Laitteen ohjelmistoversio nyt',
            'Device hardware': 'Laitteen kokoonpanoversio',
            // adminsettings.html
            'Admin Settings': 'Järjestelmäasetukset',
            'Video output resolution': 'Videolähdön resoluutio',
            'Video output rotation': 'Videolähdön rotaatio',
            'Composite video': 'Videosignaali',
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
            'Device time (UTC)': 'Laitteen aika (UTC)',
            'NTP servers': 'NTP-palvelimet',
            'Use IP address': 'Aseta IP-osoitteella',
            'Set date and time manually (UTC)': 'Aseta päivämäärä ja UTC-aika käsin',
            'Date:': 'Päivämäärä:',
            'Time:': 'Kellonaika:',
            'Factory reset': 'Palauta oletukset',
            'Restart device': 'Käynnistä laite uudelleen',
            // admin.js
            rameAutodetect: 'Automaattinen',
            rameAnalogPAL: 'Analoginen PAL',
            rameAnalogNTSC: 'Analoginen NTSC',
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
            NTP_SERVER_HOSTNAME: 'NTP-palvelimien nimet',
            ADMIN_SETTINGS_NOT_SAVED: 'Järjestelmäasetuksia ei tallennettu.',
            CHECK_INSERTED_VALUES: 'Tarkista syötetyt arvot',
            INVALID_OPTIONAL_SETTINGS: 'Valinnaisissa asetuksissa mahdollisesti epäkelpoja arvoja',
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
            MEDIA_SAFELY_REMOVED: 'Asema poistettu turvallisesti. ($1)',
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
            // recorder.component.js
            STREAMING_STARTED: 'Suoratoistopalvelu käynnistetty',
            STREAMING_STOPPED: 'Suoratoistopalvelu pysäytetty',
            RECORDING_STARTED: 'Tallennus käynnistetty',
            RECORDING_STOPPED: 'Tallennus pysäytetty',
            RECORDING_AND_STREAMING_STARTED: 'Tallennus ja suoratoistopalvelu käynnistetty',
            RECORDING_AND_STREAMING_STOPPED: 'Tallennus ja suoratoistopalvelu pysäytetty',
        });
        $translateProvider.translations('ru', {
            //'': '',
            HELP_LINK: '/help/ru/',
            // settings.html
            'User Settings': 'Настройки пользователя',
            'Automatically play files from USB': 'Автоматически проигрывать файлы из USB',
            'Language of the user interface': 'Язык пользовательского интерфейса',
            'Cluster': 'Кластер',
            'Import Configuration': 'Импорт конфигурации',
            'Export Configuration': 'Экспорт конфигурации',
            'Units': 'Устройства',
            'IP address': 'IP адрес',
            'Port': 'Порт',
            'Play Delay (sec)': 'Задержка проигрывания (сек)',
            'Add': 'Добавить',
            'Hostname': 'Имя узла',
            INFORMATION:' информация',
            'Firmware version': 'Версия прошивки',
            'Hardware version': 'Версия аппаратуры',
            // media-list.html
            'Add Directory To Work list': 'Добавить папку в рабочий список',
            // media-item.html
            'Add to Work list': 'Добавить в рабочий список',
            'Remove': 'Удалить',
            'Move to': 'Переместить в',
            // report-problem-modal.html
            'Add Unit': 'Добавить устройство ',
            'Report a Problem': 'Сообщить о проблеме',
            'Checking Internet connection': 'Проверяется соединение с интернетом',
            'Describe the problem': 'Опишите проблему',
            'Email': 'Адрес электронной почты',
            'Include logs': 'Добавить файлы журнала',
            'Send': 'Отправить',
            'Cancel': 'Отменить',
            'Close': 'Закрыть',
            'Reporter': 'Имя заполнившего',
            'download log': 'скачайте файл журнала',
            'Could not connect to the report server.': 'Не удалось подключится к серверу.',
            'Please': 'Пожалуйста,',
            'and send it to support@rameplayer.org and describe the problem in the email message.': // jshint ignore:line
                'и отправте на support@rameplayer.org с описанием ошибки в сообщении.', // jshint ignore:line
            // remove-unit-modal.html
            'Are You Sure?': 'Вы уверены?',
            'Do you really want to remove cluster unit': 'Вы действительно хотите удалить устройство из кластера',
            // import-cluster-modal.html
            'Import Cluster Configuration': 'Инмпортировать конфигурацию кластера',
            'Cluster Configuration File': 'Файл конфигурации кластера',
            'Select a file containing cluster configuration data and click Import. Note: import will override any existing configuration.': // jshint ignore:line
                'Выберите файл, содержащий данные конфигурации кластера. Заметка: импорт файла заменит текущую конфигурацию.', // jshint ignore:line
            'Import': 'Импортировать',
            // cluster-unit.html
            'Hostname unresolved': 'Имя узла не распознано',
            'Save': 'Сохранить',
            'Edit': 'Редактировать',
            'Remove unit': 'Удалить устройство',
            // sync-modal.html
            'Select Playlist To Synchronize With': 'Выберите список проигрывания для синхронизации',
            'Cluster Unit': 'Кластерное устройство',
            'Playlist': 'Список проигрывания',
            'Open': 'Открыть',
            // save-as-modal.html
            'Save Playlist As': 'Сохранить список проигрывания как',
            'Save Playlist': 'Сохранить список проигрывания',
            'Name': 'Файл',
            'Storage': 'Хранилище',
            'Playlist name': 'Название списка проигрывания',
            'Playlist with this name exists already. This playlist will overwrite existing one!': 'Список проигрывания с таким названием уже существует. Ранее сохраненный список проигрывания будет заменен этим списком!', // jshint ignore:line
            'Play this when device starts': 'Проигрывать это при включении устройства',
            'Continuous play, repeating all': 'Непрерывное воспроизведение с повтором всего списка',
            // playlist.html
            'Playlist is empty.': 'Список пустой.',
            'Title': 'Название',
            'Length': 'Длина',
            'Date': 'Дата',
            'Default': 'Рабочий список',
            'Synchronize': 'Синхронизировать',
            'Add Stream': 'Добавить видеопоток',
            'Save as': 'Сохранить как',
            'Lock': 'Закрепить',
            'Clear': 'Очистить',
            'Edit Properties': 'Редактировать параметры',
            'Stop synchronizing this playlist': 'Остановить синхронизирование этого списка проигрывания',
            // edit-modal.html
            'Edit Playlist Properties': 'Редактирование параметров списка проигрывания',
            // add-stream-modal.html
            'Add Network Stream': 'Добавление адреса видеопотока',
            'URL': 'Адрес (URL)',
            // player.html
            'Stop': 'Остановить',
            'Play on repeat': 'Повторить воспроизведение',
            'Connection error': 'Ошибка соединения',
            'Connecting...': 'Соединяется...',
            'Jump': 'Перемотать',
            'Error: no response': 'Ошибка: нет ответа',
            // main.html
            'Playlists': 'Списки проигрывания',
            'Help': 'Помощь',
            // upgrade-firmware-modal.html
            'Upgrade To': 'Обновить до',
            'Upgrade': 'Обновить',
            // restart-modal.html
            'Restart': 'Перезагрузить',
            // factory-reset-modal.html
            'You will lose all your customized settings! Device will be restarted.': 'Все установленные параметры будут потеряны! Устройство будет перезагружено.', // jshint ignore:line
            // firmware.html
            'Firmware upgrade': 'Обновление прошивки',
            'Available firmwares': 'Доступные версии прошивки',
            'Latest stable firmware version': 'Последняя стабильная версия прошивки',
            'Could not load list of firmwares available for upgrade.': 'Не удалось загрузить список версий прошивки, доступных для обновления.', // jshint ignore:line
            'Only development versions available': 'Доступны только разрабатываемые версии',
            'Current firmware': 'Текущая версия прошивки',
            'Device hardware': 'Аппаратура устройства',
            // adminsettings.html
            'Admin Settings': 'Настройки администратора',
            'Video output resolution': 'Разрешение видео',
            'Video output rotation': 'Поворот видео',
            'Audio port': 'Аудио выход',
            'HDMI and analog audio outputs are not synchronized with each other': 'Выходы HDMI и аналоговый выход звука не синхронизированы между собой', // jshint ignore:line
            rameAnalogOnly: 'Аналоговый',
            rameHdmiOnly: 'HDMI',
            rameHdmiAndAnalog: 'Оба',
            'Device name': 'Название устройства',
            'Device IP': 'IP-адрес устройства',
            'Subnet mask': 'Маска подсети',
            'Gateway IP': 'IP-адрес сетевого шлюза',
            'DNS, preferred': 'DNS, основной',
            'DNS, alternative': 'DNS, альтернативный',
            'IP Configurations': 'IP-конфигурация',
            'Configure networking manually': 'Ручная настройка сети',
            'Use as DHCP server': 'Использовать как DHCP-сервер',
            'DHCP range start': 'Начало диапазона DHCP',
            'DHCP range end': 'Конец диапазона DHCP',
            'Time Configurations': 'Конфигурация времени',
            'Device time (UTC)': 'Время устройства (UTC)',
            'NTP server': 'NTP-серверы',
            'Use IP address': 'Использовать IP-адрес',
            'Set date and time manually (UTC)': 'Ручная установка даты и времени (UTC)',
            'Date:': 'Дата:',
            'Time:': 'Время:',
            'Factory reset': 'Заводские настройки',
            'Restart device': 'Перезагрузить устройство',
            // admin.js
            DEVICE_HOSTNAME: 'Название узла устройства',
            DEVICE_IP: 'IP-адрес устройства',
            SUBNET_MASK: 'Маска подсети',
            GATEWAY_IP: 'IP-адрес сетевого шлюза',
            DNS_FIRST: 'DNS, основной',
            DNS_SECOND: 'DNS, альтернативный',
            DHCP_RANGE_START: 'Начало диапазона DHCP',
            DHCP_RANGE_END: 'Конец диапазона DHCP',
            DHCP_RANGE_DEF: 'Установка диапазона DHCP',
            MANUAL_DATE: 'дата вручную',
            MANUAL_TIME: 'время вручную',
            NTP_SERVER_HOSTNAME: 'Название узла NTP-серверов',
            ADMIN_SETTINGS_NOT_SAVED: 'Настройки администратора не сохранены.',
            CHECK_INSERTED_VALUES: 'Проверьте введенные данные',
            INVALID_OPTIONAL_SETTINGS: 'Дополнительные настройки возможно имеют неверные значения',
            // settings.js
            OPTION_SAVED: 'Параметр сохранен',
            OPTION_AUTOPLAY_USB_DESC: 'Параметр автоматического проигрывания USB',
            OPTION_ENABLED: 'вкл.',
            OPTION_DISABLED: 'выкл.',
            OPTION_SAVE_FAILED: 'Ошибка сохранения параметра',
            OPTION_AUTOPLAY_USB_FAILED_DESC: 'Ошибка сохранения параметра автоматического проигрывания USB.',
            LANGUAGE_SAVED: 'Язык сохранен.',
            INVALID_CLUSTER_SETTINGS_DESC: 'IP-адрес нового устройства',
            INVALID_SETTINGS: 'Неверные параметры',
            NEW_ADDED:'Добавлено',
            NEW_CLUSTER_UNIT_ADDED_DESC: 'Добавлено новое устройство в кластер.',
            // dataservice-provider.js
            FIRMWARE_UPGRADED: 'Прошивка обновлена',
            FIRMWARE_UPGRADED_DESC: 'Прошивка обновлена до версии $1.',
            INCOMPATIBLE_VERSION: 'Несовместимая версия',
            // statusservice.js
            CONNECTION_ERROR: 'Ошибка соединения',
            CONNECTION_ERROR_DESC: 'Не удалось соединится с устройством $1.',
            RESTART_REQUIRED: 'Требуется перезагрузка',
            RESTART_REQUIRED_DESC: 'Изменения требуют перезагрузку устройства. После перезагрузки откройте основную страницу устройства.', // jshint ignore:line
            UPDATE_AVAILABLE: 'Доступно обновление',
            // playlist.directive.js
            UPDATE_AVAILABLE_DESC: 'Доступна более новая версия ПО.',
            PLAYLIST_SYNC_REMOVED: 'Список проигрывания $1 больше не синхронизирован со списком $2.',
            //cluster-unit.directive.js
            CLUSTER: 'Кластер',
            UNIT_SETTINGS_UPDATED_DESC: 'Настройки устройства обновлены.',
            UNIT_REMOVED_DESC: 'Устройство удалено.',
            IP_ADDRESS_INVALID_DESC: 'Неверный IP-адрес.',
            CLUSTER_UNIT_SETTINGS: 'Настройки устройства кластера',
            // upgrade-firmware-modal.js
            FIRMWARE_UPGRADE_FAILED_DESC: 'Ошибка обновления прошивки.',
            UPGRADE_FAILED: 'Ошибка обновления',
            // report-problem.js
            REPORT_NOT_SENT: 'Отчет не отправлен',
            SENDING_REPORT_FAILED_DESC: 'Ошибка отправки отчета.',
            LOADING_LOGS_FAILED_DESC: 'Не удалось загрузить файлы журнала с сервера.',
            LOADING_LOGS_ERROR: 'Ошибка при загрузке файлов журнала',
            REPORT_SENT: 'Отчет отправлен',
            REPORT_SENT_SUCCESS_DESC: 'Спасибо вам за отчет!',
            // import-cluster-modal.js
            CLUSTER_CONFIG_IMPORTED: 'Конфигурация кластера импортирована',
            CLUSTER_CONFIG_IMPORTED_SUCCESS_DESC: 'Конфигурация кластера успешно импортирована.',
            // rame-version-details.html
            //Translations for info fields not used
            //for sake of consistency in debugging
            'Backend version': 'Версия бэкенда (Backend)',
            'Hardware add-on info': 'Версия дополнения оборудования (Hw add-on)',
            'Hardware config': 'Параметры оборудования (Hw cfg)',
            'Web UI version': 'Версия веб-интерфейса',
            'Details': 'Детали',
            'Software version': 'Версия ПО',
            'UI version': 'Версия UI',
            // volumes.html
            'Volumes': 'Уровни звука',
            'Volume settings are unavailable when audio out is set to:': 'Настройки уровня звука недоступны, если выбран аудио выход в:', // jshint ignore:line
            // volume-control.html
            headphone: 'Наушники',
            lineout: 'Линейный выход',
            // cluster-service.js
            CLUSTER_UNIT_OFFLINE: 'Кластерное устройство отсоединено',
            CLUSTER_UNIT_OFFLINE_DESC: 'Потеряно соединение к кластерному устройству $1.',
        });
        $translateProvider.preferredLanguage('en-us');
        $translateProvider.fallbackLanguage('en-us');
        // http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('escape');
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
            preventOpenDuplicates : true,
            target : 'body',
        });
    }

})();
