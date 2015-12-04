/*
 *
 * Overrides default exception handler
 * 
*/

(function() {
    'use strict';

    angular.module('rameplayer.core').factory(
            '$exceptionHandler', rameExceptionHandler);

    rameExceptionHandler.$inject = [
        '$log', '$injector'
    ];

    function rameExceptionHandler($log, $injector) {

        var latest = [];
        var exceptionMessage = '';

        return function(exception, cause) {            
            exceptionMessage = 'RAMEPLAYER .:. ' + exception + ' .:. ' + cause;
            if (latest.unshift(exceptionMessage) > 7) {
                latest.pop();
            }
            var root = $injector.get('$rootScope');
            root.rameException = exceptionMessage;
            root.rameExceptions = latest;
            exception.message += ' (caused by "' + cause + '")';
            $log.error(exceptionMessage);
        };
    }

})();
