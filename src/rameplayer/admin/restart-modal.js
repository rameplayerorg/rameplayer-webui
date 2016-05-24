(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('RestartModalController', RestartModalController);

    RestartModalController.$inject = ['logger', '$scope', '$timeout', '$uibModalInstance', 'dataService',
        'statusService', 'toastr', '$window', '$translate'];

    function RestartModalController(logger, $scope, $timeout, $uibModalInstance, dataService,
                                    statusService, toastr, $window, $translate) {
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
            dataService.reboot()
                .then(function(response) {
                    // restart started
                    followStatus();
                },
                function(errorResponse) {
                    logger.error('Restart failed', errorResponse);
                });
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
