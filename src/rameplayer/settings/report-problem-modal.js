(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('ReportProblemModalController', ReportProblemModalController);

    ReportProblemModalController.$inject = ['logger', '$uibModalInstance', 'dataService', 'toastr',
        'FileSaver', 'Blob'];

    function ReportProblemModalController(logger, $uibModalInstance, dataService, toastr,
                                          FileSaver, Blob) {
        var vm = this;
        var sendUrl;

        vm.checkingConnection = true;
        vm.isOnline = false;
        vm.isOffline = false;
        vm.description = '';
        vm.reporter = '';
        vm.includeLogs = true;
        vm.send = send;
        vm.cancel = cancel;
        vm.downloadLogs = downloadLogs;

        checkConnection();

        function checkConnection() {
            dataService.getReportConfig().then(function(response) {
                vm.checkingConnection = false;
                vm.isOnline = true;
                sendUrl = response.data.write;
                logger.debug('send to', sendUrl);
            },
            function() {
                // report system offline
                vm.checkingConnection = false;
                vm.isOffline = true;
            });
        }

        function send() {
            // validate reporter email
            var valid = true;
            var $reporter = $('#reporter');
            // use browser's native html5 validation
            if (typeof $reporter[0].willValidate !== 'undefined') {
                valid = $reporter[0].checkValidity();
            }

            if (valid) {
                $uibModalInstance.close();
                if (vm.includeLogs) {
                    dataService.getLog().then(function(response) {
                        sendReport(response.data);
                    },
                    function() {
                        toastr.error('Could not load logs from server.', 'Report not sent');
                        logger.error('Could not load logs from server');
                    });
                }
                else {
                    sendReport(null);
                }
            }
        }

        function sendReport(log) {
            var report = {
                description: vm.description,
                reporter: vm.reporter,
                log: log
            };
            dataService.sendReport(sendUrl, report).then(function(response) {
                toastr.success('Thank you for sending the report!', 'Report sent');
            },
            function() {
                toastr.error('Sending report failed.', 'Report not sent');
                logger.error('Could not send report to ', sendUrl);
            });
        }

        function downloadLogs() {
            dataService.getLog().then(function(response) {
                var log = response.data;
                var blob = new Blob([log], {
                    type: 'application/json;charset=utf-8'
                });
                FileSaver.saveAs(blob, 'rameplayer.log');
            },
            function() {
                toastr.error('Could not load logs from server.', 'Error loading logs');
                logger.error('Could not load logs from server');
            });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
