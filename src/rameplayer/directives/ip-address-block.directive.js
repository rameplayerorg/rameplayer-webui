(function() {
    'use strict';

    angular.module('rameplayer.directives').directive(
            'rameIpAddressBlock', rameIpAddressBlock);

    rameIpAddressBlock.$inject = ['$log'];

    function rameIpAddressBlock($log) {
        var directive = {
            link: link,
            restrict : 'E',
            templateUrl : 'rameplayer/directives/ip-address-block.html',
            scope : {
                isDisabled : '=disabilify',
                isValid: '=',
                value: '='
            },

        };
        return directive;

        function link(scope, element, attrs) {
            scope.octets = ['', '', '', ''];
            scope.isValid = false;

            scope.$watch('value', function() {
                if (scope.value) {
                    scope.octets = scope.value.split('.');
                }
                else {
                    scope.octets = ['', '', '', ''];
                }
            });

            scope.$watchCollection('octets', function() {
                // update scope.value
                scope.value = scope.octets[0] + '.' +
                    scope.octets[1] + '.' +
                    scope.octets[2] + '.' +
                    scope.octets[3];

                if (scope.value === "...")
                {
                    scope.value = undefined;
                    scope.isValid = false;
                }
                else
                    scope.isValid = validate(scope.value);
            });
        }

        // IPv4 address string regexp
        // val.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
        function validate(value) {
            if (value
                    .match(
                    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
            {
                return true;
            }
            return false;
        }
    }

})();
