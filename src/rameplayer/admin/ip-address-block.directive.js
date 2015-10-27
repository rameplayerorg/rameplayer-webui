(function() {
    'use strict';

    angular.module('rameplayer.admin').directive(
            'rameIpAddressBlock', rameIpAddressBlock);

    function rameIpAddressBlock() {
        var directive = {
            restrict : 'E',
            link : linkFunc,
            templateUrl : 'rameplayer/admin/ip-address-block.html',

            controller : 'AdminController',
            controllerAs : 'vm',
            bindToController : true,

            scope : {
                isDisabled : '=disabilify',
                octets : '=octets',
            },

        };

        return directive;

        function linkFunc(scpe, elem, attrs, vm) {
            vm.labelAddressUsage = attrs.labelAddressUsage;
                   
        }
    }

})();
