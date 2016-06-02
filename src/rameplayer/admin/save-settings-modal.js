(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('SaveSettingsModalController', SaveSettingsModalController);

    SaveSettingsModalController.$inject = ['logger', '$scope', '$timeout', '$uibModalInstance', 'dataService',
        'statusService', 'toastr', '$window', '$translate', 'systemSettings'];

    function SaveSettingsModalController(logger, $scope, $timeout, $uibModalInstance, dataService,
                                    statusService, toastr, $window, $translate, systemSettings) {
        var vm = this;

        vm.progress = 0;
        vm.status = '';
        vm.start = start;
        vm.cancel = cancel;
        vm.started = false;
        vm.statusService = statusService;

        var restarting = false;
        var restartTimeout = 2 * 60000; // 2 mins
        var restartTimeoutPromise;

        function start() {
            vm.started = true;

            systemSettings
                    .$save(function(response) {
                        vm.savingStatus = 'saved';
                        logger.debug('Admin setting save success, response: ', response);
                        toastr.success('Admin settings saved.', 'Saved');
                        statusService.resetServerNotifications();
                    }, function(response) {
                        logger.error('Admin setting save failed, response status:' + 
                                response.status + ' (' + response.statusText + ') data.error:' +
                                (response.data ? response.data.error : ' (data is null)'));
                        logger.debug(response);
                        toastr.error('Saving admin settings failed.', 'Saving failed', {
                            timeOut : 10000,
                            closeButton : true
                        });
                        statusService.resetServerNotifications();
                        //throw new Error(response.status + ' ' + response.statusText, response.data.error); 
                    });




/*
            dataService.factoryReset()
                .then(function(response) {
                    // restart started
                    followStatus();
                },
                function(errorResponse) {
                    logger.error('Restart failed', errorResponse);
                });
               */
        }

        function followStatus() {
            vm.progress = 100;
            $scope.$watch('vm.statusService.status.state', function(newState) {
                if (newState === statusService.states.offline) {
                    // server went offline, most probably rebooting
                    restartBegan();
                }
                else if (restarting && newState !== statusService.states.offline) {
                    // received first status after restart
                    restartFinished();
                }
            });
        }

        function restartBegan() {
            restarting = true;
            vm.status = 'Waiting for device to restart...';
            restartTimeoutPromise = $timeout(function() {
                vm.status = 'Could not connect to device. Check if IP address has changed.';
            }, restartTimeout);
        }

        function restartFinished() {
            // device has restarted, reload page without cache
            vm.status = 'Reloading page...';
            $window.location.reload(true);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
