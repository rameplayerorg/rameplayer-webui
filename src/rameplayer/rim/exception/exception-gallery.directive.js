(function() {
    'use strict';

    angular.module('rameplayer.rim.exception').directive(
            'rameExceptionGallery', rameExceptionGallery);

    function rameExceptionGallery() {
        var directive = {
            restrict : 'E',
            link : linkFunc,
            templateUrl : 'rameplayer/rim/exception/exception-gallery.html',

            controller : 'ExceptionController',
            controllerAs : 'vm',
            bindToController : true,

            scope : {
                isDisabled : '=disabilify',
            },

        };

        return directive;

        function linkFunc(scpe, elem, attrs, vm) {
        }
    }

})();

