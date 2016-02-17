(function() {
    'use strict';

    angular.module('rameplayer.directives').directive(
            'rameTimeSlider', rameTimeSlider);

    function rameTimeSlider() {
        var directive = {
            link: link,
            restrict : 'E',
            templateUrl : 'rameplayer/player/time-slider.html',
            scope : {
                position: '=',
                duration: '=',
                onSeek: '&'
            },
            controller: TimeSliderController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        function link(scope, element, attrs) {
            scope.vm.slider = $(element).children('.time-slider');
        }
    }

    TimeSliderController.$inject = ['$scope', '$log', '$timeout'];

    function TimeSliderController($scope, $log, $timeout) {
        var vm = this;
        var seeking = false;
        // prevent seek for chokingTime
        var chokingTime = 1000;
        var choked = false;
        var lastSeekPos = null;

        vm.mousePos = 0;
        vm.percentage = 0;
        vm.startSeek = startSeek;
        vm.seek = seek;
        vm.stopSeek = stopSeek;

        $scope.$watchGroup(['vm.position', 'vm.duration'], function() {
            updatePercentage();
        });

        // stop seeking also when mouse button gets up elsewhere
        $(document).mouseup(function(event) {
            if (seeking) {
                stopSeek(event);
            }
        });

        // keep dragging slider everywhere on page
        $(document).mousemove(function(event) {
            if (seeking) {
                seek(event, true);
            }
        });

        function updatePercentage() {
            var percentage = 0;
            if (vm.position !== undefined && vm.duration !== undefined) {
                percentage = vm.position / vm.duration * 100;
                if (percentage < 0) {
                    percentage = 0;
                }
                if (percentage > 100) {
                    percentage = 100;
                }
            }
            vm.percentage = percentage;
        }

        function startSeek($event) {
            seeking = true;
        }

        function seek(event, obeyChoke) {
            var seekToPos = getPosByEvent(event);
            // do not seek twice to same pos
            if (seekToPos !== lastSeekPos && (!obeyChoke || !choked)) {
                vm.onSeek({
                    position: seekToPos
                });
                choked = true;
                $timeout(function() {
                    choked = false;
                }, chokingTime);
                lastSeekPos = seekToPos;
            }
        }

        function getPosByEvent(event) {
            // get clicked position in % of time-slider width
            var x = event.pageX - vm.slider.offset().left;
            var relative = x / vm.slider.width();
            if (relative < 0) {
                relative = 0;
            }
            if (relative > 1) {
                relative = 1;
            }
            var pos = relative * vm.duration;
            return pos;
        }

        function stopSeek(event) {
            seek(event, false);
            seeking = false;
            lastSeekPos = null;
        }
    }
})();
