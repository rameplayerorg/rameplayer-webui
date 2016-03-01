(function() {
    'use strict';

    angular
        .module('rameplayer.directives')
        .directive('rameReadJsonFile', rameReadJsonFile);

    rameReadJsonFile.$inject = ['logger', 'FileReader', 'toastr'];

    function rameReadJsonFile(logger, FileReader, toastr) {
        var fileEncoding = 'utf-8';

        var directive = {
            restrict: 'A', // only attribute
            scope: {
                jsonCallback: '&rameReadJsonFile'
            },
            link: link
        };
        return directive;

        function link(scope, element, attr) {
            element.on('change', function(e) {
                readFile(scope, e);
            });
        }

        function readFile(scope, event) {
            var file = (event.srcElement || event.target).files[0];
            var promise = FileReader.readAsText(file, fileEncoding, scope);
            promise.then(function(content) {
                var data;
                try {
                    data = angular.fromJson(content);
                }
                catch (e) {
                    logger.error('Imported file was not valid JSON');
                    toastr.error('Selected file was not valid JSON.', 'Invalid File');
                }
                if (data !== undefined) {
                    scope.jsonCallback({
                        data: data
                    });
                }
            });
        }
    }
})();
