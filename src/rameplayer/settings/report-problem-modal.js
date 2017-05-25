(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('ReportProblemModalController', ReportProblemModalController);

    ReportProblemModalController.$inject = ['logger', '$uibModalInstance', 'dataService', 'toastr',
        'FileSaver', 'Blob', '$translate'];

    function ReportProblemModalController(logger, $uibModalInstance, dataService, toastr,
                                          FileSaver, Blob, $translate) {
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
                    dataService.getServerLog().then(function(response) {
                        sendReport(response.data);
                    },
                    function() {
                        $translate(['REPORT_NOT_SENT', 'LOADING_LOGS_FAILED_DESC'])
                        .then(function(translations) {
                            toastr.error(translations.LOADING_LOGS_FAILED_DESC, translations.REPORT_NOT_SENT);
                        });
                        logger.error('Could not load logs from server');
                    });
                }
                else {
                    sendReport(null);
                }
            }
        }

        function sendReport(serverLog) {
            var report = {
                description: vm.description,
                reporter: vm.reporter,
                serverLog: serverLog,
                uiLog: dataService.getUILog()
            };
            dataService.sendReport(sendUrl, report).then(function(response) {
                $translate(['REPORT_SENT', 'REPORT_SENT_SUCCESS_DESC'])
                .then(function(translations) {
                    toastr.success(translations.REPORT_SENT_SUCCESS_DESC, translations.REPORT_SENT);
                });
            },
            function(response) {
                $translate(['REPORT_NOT_SENT', 'SENDING_REPORT_FAILED_DESC'])
                .then(function(translations) {
                    toastr.error(translations.SENDING_REPORT_FAILED_DESC, translations.REPORT_NOT_SENT);
                });                
                logger.error('Could not send report to ', sendUrl);
                logger.debug('Could not send report, response: ', response.data);
            });
        }

        function downloadLogs() {
            dataService.getServerLog().then(function(response) {
                var log = response.data;
                var blob = new Blob([log], {
                    type: 'application/json;charset=utf-8'
                });
                FileSaver.saveAs(blob, 'rameplayer.log');
            },
            function() {
                $translate(['LOADING_LOGS_ERROR', 'LOADING_LOGS_FAILED_DESC'])
                .then(function(translations) {
                    toastr.error(translations.LOADING_LOGS_FAILED_DESC, translations.LOADING_LOGS_ERROR);
                });
                logger.error('Could not load logs from server');
            });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
