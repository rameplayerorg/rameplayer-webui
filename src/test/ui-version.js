(function() {
    'use strict';

    // uiVersion needs to be defined, index.html is not included in tests
    angular
        .module('rameplayer.core')
        .constant('uiVersion', 'development');
})();
