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
            exceptionMessage = 'RAMEPLAYER .:. ' + exception + ' .:. (caused by ' + cause + ')';
            if (latest.unshift(exceptionMessage) > 7) {
                latest.pop();
            }
            var root = $injector.get('$rootScope');
            root.rameException = exceptionMessage;
            root.rameExceptions = latest;
            
            //exception.message += ' (caused by "' + cause + '")';
            $log.error(exceptionMessage);            
                        
            // Toasts thrown from arbitrary exception overrides more settings to make them sticky
            // $injector.get('toastr').error(exceptionMessage);
            $injector.get('toastr').error(
                    '' + exception, 
                    'Exception (" + cause + ")',
                    {
                        allowHtml : false,
                        closeButton : true,
                        closeHtml : '<button>&times;</button>',
                        extendedTimeOut : 0,
                        iconClasses : {
                            error : 'toast-error',
                            //    info : 'toast-info',
                            //    success : 'toast-success',
                            //    warning : 'toast-warning'
                        },
                        messageClass : 'toast-message',
                        onHidden : null,
                        onShown : null,
                        onTap : null,
                        progressBar : false,
                        tapToDismiss : true,
                        //templates: {
                        //    toast: 'directives/toast/toast.html',
                        //    progressbar: 'directives/progressbar/progressbar.html'
                        //},
                        timeOut : 0,
                        titleClass : 'toast-title',
                        toastClass : 'toast'
                    }
            );
            
        };
    }
    
})();
