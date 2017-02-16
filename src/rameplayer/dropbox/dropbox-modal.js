(function() {
    'use strict';

    angular
        .module('rameplayer.dropbox')
        .controller('DropboxModalController', DropboxModalController);

    DropboxModalController.$inject = ['logger', '$window', '$uibModalInstance',
        'dataService', 'listId', 'Dropbox', '$interval'];

    function DropboxModalController(logger, $window, $uibModalInstance,
                                    dataService, listId, Dropbox, $interval) {
        var vm = this;
        vm.account = null;
        vm.ready = false;
        vm.dropboxPath = '/RamePlayer';

        vm.connect = connect;
        vm.close = closeModal;
        vm.revoke = revoke;
        init();

        function init() {
            logger.debug('DropboxModal init()', listId);
            getAccountInfo();

            // stop polling when modal is closed
            $uibModalInstance.result.then(function() {
                stopPolling();
            }, function() {
                stopPolling();
            });
        }

        function getAccountInfo() {
            dataService.getDropboxAuth(listId)
                .then(function(response) {
                    vm.ready = true;
                    if (response.data.account) {
                        vm.account = response.data.account;
                        stopPolling();
                    }
                    else {
                        // no dropbox authentication for this listId
                        logger.debug('No Dropbox authentication for', listId);
                    }
                });
        }

        function connect() {
            var url = 'http://www.dropbox.com/1/oauth2/authorize?response_type=code&client_id=';
            url += Dropbox.APP_KEY;
            url += '&redirect_uri=';
            url += $window.encodeURIComponent(Dropbox.REDIRECT_URI);
            url += '&state=';
            // this data will be forwarded to Dropbox.REDIRECT_URI
            var fwdState = 'rame;' + dataService.getDropboxAuthUrl(listId) + ';';
            fwdState += vm.dropboxPath;
            url += $window.encodeURIComponent(fwdState);
            // open link in new window
            $window.open(url, '_blank');
            startPolling();
        }

        function closeModal() {
            $uibModalInstance.dismiss();
            stopPolling();
        }

        function revoke() {
            dataService.removeDropboxAuth(listId)
                .then(function(response) {
                    vm.account = null;
                });
        }

        function startPolling() {
            logger.debug('startPolling');
            // poll every 2 sec, max 300 times
            var interval = 2000;
            vm.pollerHandler = $interval(getAccountInfo, interval, 300);
        }

        function stopPolling() {
            if (vm.pollerHandler) {
                $interval.cancel(vm.pollerHandler);
                vm.pollerHandler = undefined;
            }
        }
    }
})();
