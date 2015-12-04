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
        '$log'
    ];

    function rameExceptionHandler($log) {

        var latest = [];
        var exceptionMessage = '';

        return function(exception, cause) {
            exceptionMessage = 'RAMEPLAYER .:. ' + exception + ' .:. ' + cause;
            if (latest.unshift(exceptionMessage) > 7) {
                latest.pop();
            }
            exception.message += ' (caused by "' + cause + '")';
            $log.error(exceptionMessage);
        };
    }

})();
