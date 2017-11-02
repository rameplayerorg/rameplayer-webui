/*jshint maxparams:12 */

(function() {
    'use strict';

    angular
        .module('rameplayer.recorder')
        .component('rameRecorder', {
            templateUrl: 'rameplayer/recorder/recorder.component.html',
            controller: Controller
        });

    Controller.$inject = ['$rootScope', 'logger', '$uibModal', 'dataService', 'statusService'];

    function Controller($rootScope, logger, $uibModal, dataService, statusService) {
        var ctrl = this;
        ctrl.config = {
            streamingEnabled: true,
            recorderEnabled: false,
            input: 'hdmi',
            bitrate: 3000,
            recordingPath: '/media/sda1/recording.mp4',
            streamNum: '1',
        };

        ctrl.statusService = statusService;
        ctrl.start = start;
        ctrl.stop = stop;
        init();

        function init() {
        }

        function start() {
            // convert bitrate to int
            ctrl.config.bitrate = parseInt(ctrl.config.bitrate);
            if (isNaN(ctrl.config.bitrate)) {
                ctrl.config.bitrate = 0;
            }

            logger.log('start', ctrl.config);
            dataService.startRecorderServices(ctrl.config)
                .then(function(response) {
                    logger.debug('START response', response);
                });
        }

        function stop() {
            logger.log('stop', ctrl.config);
            dataService.stopRecorderServices()
                .then(function(response) {
                    logger.debug('STOP response', response);
                });
        }
    }

})();
