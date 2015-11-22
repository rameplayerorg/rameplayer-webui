(function() {
    'use strict';

    // angular.module('rameplayer.rim.exception')
    angular.module('rameplayer.core')
        .factory('$exceptionHandler', function() {
        return function(exception, cause) {
            exception.message += ' (caused by "' + cause + '")';
            throw new Error("luuluu");
        };
    });
    
   /* .config(exceptionConfig);


exceptionConfig.$inject = ['$provide'];


function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
}


extendExceptionHandler.$inject = ['$delegate', 'toastr'];


function extendExceptionHandler($delegate, toastr) {
    return function(exception, cause) {
        $delegate(exception, cause);
        var errorData = {
            exception: exception,
            cause: cause
        };
        /**
         * Could add the error to a service's collection,
         * add errors to $rootScope, log errors to remote web server,
         * or log locally. Or throw hard. It is entirely up to you.
         * throw exception;
         *
        exception.msg += "rame";
        toastr.error(exception.msg, errorData);
    };
}*/ 
    
    /*var rameException = angular
        .module('rameplayer.rim.exception', []);
    rameException
        .factory(
            '$exceptionHandler',
            function() {
                return function(exception, cause) {
                    exception.message += ' (caused by "' + cause + '")';
                    //$log.error('RAME luluuuu');
                    throw new Error('RAME luluuuu');
                };});*/
            //rameExceptionHandler);

    

    /*
     * rameExceptionHandler.$inject = ['$log'];
     * function rameExceptionHandler( $log) {
        //$log.error('RAME luluuuu');
        return function(exception, cause) {
            $log.error('RAME luluuuu');
            exception.message += ' (caused by "' + cause + '")';
            $log.error(exception, 'RAME ' + cause);
            //ExceptionController.message = "huhgh";
        };
    }*/
    
})();
