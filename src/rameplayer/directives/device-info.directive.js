/**
 * 
 */
(function() {
    'use strict';

    angular.module('rameplayer.directives').directive(
            'rameDeviceInfo', rameDeviceInfo);

    rameDeviceInfo.$inject = ['$log'];

    function rameDeviceInfo($log) {
        var directive = {
            link: link,
            restrict : 'E',
            templateUrl : 'rameplayer/directives/device-info.html',
            scope : {
            },

        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();
