(function() {
    'use strict';

    angular.module('rameplayer.admin').directive(
            'rameIpAddressBlock', rameIpAddressBlock);

    function rameIpAddressBlock() {
        var directive = {
            restrict : 'E',
            transclude: true,
            templateUrl : 'rameplayer/admin/ip-address-block.html',
            scope : {
                isDisabled : '=disabilify',
                octets : '=octets'
            },

        };
        return directive;
    }

})();
