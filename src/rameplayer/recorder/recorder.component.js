(function() {
    'use strict';

    angular
        .module('rameplayer.recorder')
        .component('rameRecorder', {
            templateUrl: 'rameplayer/recorder/recorder.component.html',
            controller: Controller
        });

    Controller.$inject = ['logger', 'dataService', 'statusService', 'toastr',
        '$translate', '$location', '$timeout', '$interval'];

    function Controller(logger, dataService, statusService, toastr, $translate, $location, $timeout, $interval) {
        var statusInterval = 4000;
        var pollerHandler = null;

        var ctrl = this;
        ctrl.config = {};
        ctrl.avgVideoBitrateChanged = avgVideoBitrateChanged;
        ctrl.locationHost = $location.host();
        ctrl.statusService = statusService;
        ctrl.start = start;
        ctrl.stop = stop;
        ctrl.recPathChanged = recPathChanged;
        ctrl.stopping = false;
        init();

        function init() {
            dataService.getRecorderConfig()
                .then(function(response) {
                    if (response.data) {
                        ctrl.config = response.data;
                        if (ctrl.statusService.status.recorder.running) {
                            pollerHandler = startRecStatusPoller();
                        }
                        else {
                            validateRecordingPath();
                        }
                    }
                });
        }

        function startRecStatusPoller() {
            stopRecStatusPoller();
            logger.debug('Starting rec status poller()');
            return $interval(validateRecordingPath, statusInterval);
        }

        function stopRecStatusPoller() {
            if (pollerHandler) {
                $interval.cancel(pollerHandler);
                pollerHandler = null;
            }
        }

        function avgVideoBitrateChanged() {
            var value = parseInt(ctrl.config.avgVideoBitrate);
            // add 100 kbps for max value
            ctrl.config.maxVideoBitrate = '' + (value + 100);
            recPathChanged();
        }

        function start() {
            ctrl.statusInfo = '...';
            ctrl.stopping = false;
            ctrl.recWarning = ctrl.prevRecWarning = null;
            ctrl.recError = ctrl.prevRecError = null;
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

                    //if (ctrl.config.recorderEnabled) {
                    // always start this - we don't need the disk
                    // space info, but for now we get the other
                    // status info from there (needs some cleaning up)
                    pollerHandler = startRecStatusPoller();
                    //}
                },
                function(response) {
                    logger.error('Recorder error', response);
                    toastr.error(response.data.error, 'Recorder Error');
                });
        }

        function stop() {
            ctrl.stopping = true;
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
                            recPathChanged();
                        });

                    stopRecStatusPoller();
                });
        }

        function recPathChanged() {
            var delay = 500;
            if (ctrl.recPathPromise) {
                // cancel previous
                $timeout.cancel(ctrl.recPathPromise);
                ctrl.recPathPromise = null;
            }
            ctrl.recPathPromise = $timeout(function() {
                validateRecordingPath();
            }, delay);
        }

        // should rename or split this
        function validateRecordingPath() {
            dataService.getDiskStatus(ctrl.config.recordingPath)
                .then(function(response) {
                    ctrl.recWarning = response.data.warn;
                    ctrl.recError = response.data.error;
                    if (ctrl.prevRecWarning !== ctrl.recWarning &&
                        ctrl.recWarning && ctrl.recWarning.length > 0)
                    {
                        toastr.warning(ctrl.recWarning, 'Warning', {
                            timeOut: 0, tapToDismiss: true
                        });
                        ctrl.prevRecWarning = ctrl.recWarning;
                    }
                    if (ctrl.prevRecError !== ctrl.recError &&
                        ctrl.recError && ctrl.recError.length > 0)
                    {
                        toastr.error(ctrl.recError, 'Error', {
                            timeOut: 0, tapToDismiss: false, closeButton: true
                        });
                        ctrl.prevRecError = ctrl.recError;
                    }

                    if (ctrl.statusService.status.recorder.running) {
                        ctrl.errorRecFileExists = false;
                        ctrl.errorRecNoDir = false;
                        ctrl.validRecPath = true;
                        ctrl.statusInfo = response.data.info;
                    }
                    else if (ctrl.statusService.status.recorder.stopping) {
                        ctrl.statusInfo = response.data.info;
                    }
                    else {
                        ctrl.errorRecFileExists = !!response.data.file;
                        ctrl.errorRecNoDir = !response.data.dir;
                        ctrl.validRecPath = !ctrl.errorRecFileExists && !ctrl.errorRecNoDir;
                        ctrl.statusInfo = null;
                    }
                    ctrl.freeSpace = (response.data.space) ? response.data.space.available : undefined;
                    ctrl.fsType = (response.data.space) ? response.data.space.type : undefined;
                    ctrl.hasRecBlockingError = !ctrl.validRecPath;
                    if (ctrl.freeSpace !== undefined && ctrl.freeSpace === 0)
                    {
                        ctrl.hasRecBlockingError = true;
                    }
                    calcTimeLeft();
                },
                function(response) {
                    logger.debug('Error with disk status: ', response.data);
                    ctrl.validRecPath = false;
                    ctrl.errorRecFileExists = false;
                    ctrl.errorRecNoDir = false;
                    ctrl.freeSpace = undefined;
                    ctrl.fsType = undefined;
                    ctrl.hasRecBlockingError = true;
                });
        }

        function calcTimeLeft() {
            var videoBitRate = parseInt(ctrl.config.avgVideoBitrate) || 0;
            // use a guess when reasonable:
            var audioBitRate = parseInt(ctrl.config.audioBitrate) || (videoBitRate > 0 ? 250 : 0);
            var conservativeFudgeFactor = 1.05;
            var bytesPerSec = parseInt(conservativeFudgeFactor * (videoBitRate + audioBitRate)) * 1000 / 8;
            if (bytesPerSec > 0)
            {
                var usableSpace = ctrl.freeSpace;
                ctrl.recTimeNote = '';
                if (typeof ctrl.fsType === 'string' && ctrl.fsType === 'vfat')
                {
                    var almost4KGB = 4 * 1000 * 1024;
                    if (usableSpace > almost4KGB)
                    {
                        usableSpace = almost4KGB;
                        ctrl.recTimeNote = 'Max 4GB in FAT-fs: ';
                    }
                }
                ctrl.recTimeLeft = usableSpace * 1024 / bytesPerSec / 60; // mins left
                if (ctrl.recTimeLeft > 1)
                {
                    ctrl.recTimeNote += '~';
                }
            }
            else
            {
                ctrl.recTimeLeft = 0;
                ctrl.recTimeNote = '';
            }
        }
    }

})();
