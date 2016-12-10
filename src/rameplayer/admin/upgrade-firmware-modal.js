(function() {
    'use strict';

    angular
        .module('rameplayer.admin')
        .controller('UpgradeFirmwareModalController', UpgradeFirmwareModalController);

    UpgradeFirmwareModalController.$inject = ['logger', '$scope', '$timeout', '$uibModalInstance', 'dataService',
        'upgradeSelection', 'statusService', 'toastr', '$window', '$translate'];

    function UpgradeFirmwareModalController(logger, $scope, $timeout, $uibModalInstance, dataService,
                                            upgradeSelection, statusService, toastr, $window, $translate) {
        var vm = this;

        vm.progress = 0;
        vm.status = '';
        vm.upgradeSelection = upgradeSelection;
        vm.start = start;
        vm.cancel = cancel;
        vm.started = false;
        vm.statusService = statusService;

        var restarting = false;
        var restartTimeout = 2 * 60000; // 2 mins
        var restartTimeoutPromise;

        function start() {
            vm.started = true;
            // server status is now needed for polling even though page is not visible
            vm.statusService.setVisibilityDetection(false);
            dataService.upgradeFirmware(vm.upgradeSelection.uri)
                .then(function(response) {
                    // upgrade started
                    followStatus();
                },
                function(errorResponse) {
                    logger.error('Firmware upgrade failed', vm.upgradeSelection, errorResponse);
                    $translate(['UPGRADE_FAILED', 'FIRMWARE_UPGRADE_FAILED_DESC'])
                    .then(function(translations) {
                        toastr.error(
                                translations.FIRMWARE_UPGRADE_FAILED_DESC + vm.upgradeSelection.title + '.', 
                                translations.UPGRADE_FAILED);
                    });
                    followStatus();
                });
        }

        function followStatus() {
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

            // update progress bar
            $scope.$watch('vm.statusService.status.player.upgradeProgress', function(newProgress) {
                if (newProgress !== undefined) {
                    vm.progress = newProgress;
                }
            });
        }

        function restartBegan() {
            vm.progress = 100;
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
