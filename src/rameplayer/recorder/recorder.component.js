(function() {
    'use strict';

    angular
        .module('rameplayer.recorder')
        .component('rameRecorder', {
            templateUrl: 'rameplayer/recorder/recorder.component.html',
            controller: Controller
        });

    Controller.$inject = ['logger', 'dataService', 'statusService', 'toastr', '$translate', '$location'];

    function Controller(logger, dataService, statusService, toastr, $translate, $location) {
        var ctrl = this;
        ctrl.config = {};
        ctrl.avgVideoBitrateChanged = avgVideoBitrateChanged;
        ctrl.locationHost = $location.host();
        ctrl.statusService = statusService;
        ctrl.start = start;
        ctrl.stop = stop;
        init();

        function init() {
            dataService.getRecorderConfig()
                .then(function(response) {
                    if (response.data) {
                        ctrl.config = response.data;
                    }
                });
        }

        function avgVideoBitrateChanged() {
            var value = parseInt(ctrl.config.avgVideoBitrate);
            // add 100 kbps for max value
            ctrl.config.maxVideoBitrate = value + 100;
        }

        function start() {
            // convert bitrate to int
            ctrl.config.bitrate = parseInt(ctrl.config.bitrate);
            if (isNaN(ctrl.config.bitrate)) {
                ctrl.config.bitrate = 0;
            }

            dataService.startRecorderServices(ctrl.config)
                .then(function(response) {
                    $translate(['STREAMING_STARTED', 'RECORDING_STARTED', 'RECORDING_AND_STREAMING_STARTED'])
                        .then(function(translations) {
                            if (ctrl.config.recorderEnabled && ctrl.config.streamingEnabled) {
                                toastr.success(ctrl.config.recordingPath, translations.RECORDING_AND_STREAMING_STARTED);
                            }
                            else if (ctrl.config.recorderEnabled) {
                                toastr.success(ctrl.config.recordingPath, translations.RECORDING_STARTED);
                            }
                            else if (ctrl.config.streamingEnabled) {
                                toastr.success(translations.STREAMING_STARTED);
                            }
                        });
                });
        }

        function stop() {
            dataService.stopRecorderServices()
                .then(function(response) {
                    $translate(['STREAMING_STOPPED', 'RECORDING_STOPPED', 'RECORDING_AND_STREAMING_STOPPED'])
                        .then(function(translations) {
                            if (ctrl.config.recorderEnabled && ctrl.config.streamingEnabled) {
                                toastr.success(ctrl.config.recordingPath, translations.RECORDING_AND_STREAMING_STOPPED);
                            }
                            else if (ctrl.config.recorderEnabled) {
                                toastr.success(ctrl.config.recordingPath, translations.RECORDING_STOPPED);
                            }
                            else if (ctrl.config.streamingEnabled) {
                                toastr.success(translations.STREAMING_STOPPED);
                            }
                        });
                });
        }
    }

})();
