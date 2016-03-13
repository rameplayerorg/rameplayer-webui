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
            scope.vm.seekTarget = scope.vm.slider.children('.time-slider-handle-target');

            // create tooltip instance
            scope.vm.slider.tooltip({
                trigger: 'manual',
                animation: false,
                title: '-',
            });
        }
    }

    TimeSliderController.$inject = ['$scope', '$log', '$interval', '$filter', 'statusService',
        '$pageVisibility'];

    function TimeSliderController($scope, $log, $interval, $filter, statusService,
                                  $pageVisibility) {
        var vm = this;
        var seeking = false;
        var seekIntervalTime = 500;
        var seekIntervalHandle;
        var seekToPos = null;
        var lastSeekPos = null;
        var tooltipElem;
        var tooltipElemText;

        vm.percentage = null;
        vm.startSeek = startSeek;
        vm.stopSeek = stopSeek;
        vm.showMousePos = showMousePos;
        vm.hideMousePos = hideMousePos;
        vm.playerStatus = statusService.status;

        $scope.$watchGroup(['vm.position', 'vm.duration'], function() {
            updatePercentage();
        });

        // stop seeking also when mouse button gets up elsewhere
        $(document).on('mouseup', function(event) {
            if (seeking) {
                stopSeek(event);
            }
        });

        // make sure to stop seeking in case of dragend event
        // for some reason event.pageX is weird
        $(document).on('dragend', function(event) {
            seeking = false;
            vm.seekTarget.hide();
        });

        // keep dragging slider everywhere on page
        $(document).on('mousemove', function(event) {
            if (seeking) {
                countSeekToPos(event);
                moveSeekTarget(event);
            }
        });

        $pageVisibility.$on('pageBlurred', pageBlurred);

        function updatePercentage() {
            var percentage = null;
            if (vm.position !== undefined && vm.duration) {
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
            countSeekToPos($event);
            seeking = true;
            moveSeekTarget($event);
            vm.seekTarget.show();
            seekIntervalHandle = $interval(function() {
                if (seekToPos !== undefined && seekToPos !== lastSeekPos) {
                    vm.onSeek({
                        position: seekToPos
                    });
                    lastSeekPos = seekToPos;
                }
            }, seekIntervalTime);
        }

        function countSeekToPos(event) {
            seekToPos = getPosByEvent(event);
        }

        function getPosByEvent(event) {
            if (!vm.duration) {
                return undefined;
            }
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
            $interval.cancel(seekIntervalHandle);
            seekIntervalHandle = undefined;
            if (seekToPos !== undefined) {
                vm.onSeek({
                    position: seekToPos
                });
            }
            vm.seekTarget.hide();
            seeking = false;
            lastSeekPos = null;
        }

        /**
         * @name showMousePos
         * @description Shows position under mouse cursor in tooltip
         */
        function showMousePos(event) {
            if (!vm.duration) {
                return;
            }
            var mousePos = getPosByEvent(event);
            mousePos = $filter('playerTime')(mousePos);
            if (tooltipElem !== undefined && tooltipElem.length !== 0) {
                // change tooltip text
                tooltipElemText.html(mousePos);

                // move tooltip horizontally
                var left = event.clientX - (tooltipElem.width() / 2);
                tooltipElem.css({
                    left: left,
                    display: 'block'
                });
            }
            else {
                vm.slider.one('shown.bs.tooltip', function(showEvent) {
                    // show tooltip first time in right place
                    tooltipElem = $(showEvent.target).next('.tooltip');
                    tooltipElemText = tooltipElem.children('.tooltip-inner');
                    showMousePos(event);
                });
                vm.slider.tooltip('show');
            }
        }

        function hideMousePos() {
            if (tooltipElem !== undefined) {
                tooltipElem.hide();
            }
        }

        /**
         * @name moveSeekTarget
         * @description Moves handle target element (ghost) so user sees
         * where seek is going to happen
         */
        function moveSeekTarget(event) {
            var left = event.pageX - vm.slider.offset().left;
            if (left < 0) {
                left = 0;
            }
            if (left > vm.slider.width()) {
                left = vm.slider.width();
            }
            vm.seekTarget.css({
                left: left
            });
        }

        function pageBlurred() {
            // hide time-slider progress and handle, so it will
            // jump without transition to correct place when page
            // is visible again
            vm.percentage = null;
        }
    }
})();
