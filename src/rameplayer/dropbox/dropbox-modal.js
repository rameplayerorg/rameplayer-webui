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
        vm.appKey = Dropbox.APP_KEY;
        vm.redirectUri = $window.encodeURIComponent(Dropbox.REDIRECT_URI);
        // information to be forwarded to authentication broker
        vm.fwdState = $window.encodeURIComponent('rame;' + dataService.getDropboxAuthUrl(listId));
        
        vm.close = closeModal;
        vm.revoke = revoke;
        vm.startPolling = startPolling;
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
