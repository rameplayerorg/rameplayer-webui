/**
 * Forked from:
 * https://github.com/plantsmiles/bootstrap-colorselector
 * Author: John Samuelson <johnsamuelson@icloud.com>
 * License: MIT
 */

angular.module('ngBootstrapColorSelector', [])
    .directive('ngBootstrapColorSelector', function() {
        return {
            restrict: 'E',
            templateUrl: 'rameplayer/directives/ng-bootstrap-colorselector.html',
            scope: {
                colorSelected: '=',
                colors: '='
            },
            link: function (scope, element, attr) {
                scope.colorSelected = scope.colorSelected || '#A0522D';
                scope.changeColor = function(color) {
                    scope.colorSelected = color;
                };
            }
        };
    });
