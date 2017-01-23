(function() {
    'use strict';

    angular
        .module('rameplayer.dropbox')
        .controller('DropboxModalController', DropboxModalController);

    DropboxModalController.$inject = ['logger', '$window', '$uibModalInstance',
        'dataService', 'listId', 'Dropbox'];

    function DropboxModalController(logger, $window, $uibModalInstance,
                                    dataService, listId, Dropbox) {
        var vm = this;

        vm.appKey = Dropbox.APP_KEY;
        vm.redirectUri = $window.encodeURIComponent(Dropbox.REDIRECT_URI);
        // information to be forwarded to authentication broker
        vm.fwdState = $window.encodeURIComponent('rame;' + dataService.getDropboxAuthUrl(listId));
        
        vm.close = closeModal;
        init();

        function init() {
            logger.debug('DropboxModal init()', listId);
        }

        function closeModal() {
            $uibModalInstance.dismiss();
        }
    }
})();
