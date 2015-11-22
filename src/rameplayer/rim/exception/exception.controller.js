(function() {
    'use strict';

    angular
        .module('rameplayer.rim.exception', [])
        .controller(
            'ExceptionController', ExceptionController);

    ExceptionController.$inject = ['$log', '$exceptionHandler'];

    function ExceptionController($log, $exceptionHandler) {
        var vm = this;
        
        //vm.message = "laalaa";
        vm.message = $exceptionHandler.message;
    }
    
})();
