(function () {
    "use strict";

    var appModule = angular.module('app');

    appModule.controller('timePickerWidgetCtrl', function ($scope, $uibModalInstance, time) {

        $scope.time = time;
        $scope.isPM = time.time.getHours() >= 12;
        $scope.minuteMode = false;
        $scope.clockDigits = [];
        $scope.selected = {
            hour: $scope.isPM ? $scope.time.time.getHours() - 12 : $scope.time.time.getHours(),
            minute: $scope.time.time.getMinutes()
        };

        init();

        function init() {
            $scope.clockDigits = [];

            var pL = 10;    // padding left
            var pT = 10;    // padding top
            var mL = 20;    // margin left
            var mT = 10;    // margin top

            var r = 111.5;  // width / 2
            var j = r / 1.2 // coeficient

            // algorithm for arranging digits on a clock circle
            for (var h = 0; h < 12; ++h) {
                var x = j * Math.sin(Math.PI * 2 * (h / 12));
                var y = j * Math.cos(Math.PI * 2 * (h / 12));

                var hour = {
                    left: (r + x + pL / 2) - (pL + mL),
                    top: (r - y - mT / 2) - (pT + mT),
                    value: ($scope.minuteMode ? (h * 5) : h)
                };

                if ($scope.minuteMode) {
                    hour.display = hour.value < 10 ? ('0' + hour.value) : hour.value;
                } else {
                    hour.display = (h === 0) ? 12 : h;
                }

                $scope.clockDigits.push(hour);
            }

            rotateClockLine();
        };

        function rotateClockLine() {
            var degree = 0;

            if ($scope.minuteMode) {
                degree = ((360 / 60) * (5 * Math.round($scope.selected.minute / 5)));
            } else {
                var hour = ($scope.isPM ? $scope.selected.hour + 12 : $scope.selected.hour);
                degree = hour * (360 / 12);
            }

            $scope.rotate = {
                '-moz-transform': 'rotate(' + degree + 'deg)',
                '-ms-transform': 'rotate(' + degree + 'deg)',
                '-webkit-transform': 'rotate(' + degree + 'deg)',
                '-o-transform': 'rotate(' + degree + 'deg)',
                'transform': 'rotate(' + degree + 'deg)'
            };
        };

        $scope.mouseMoveOverClock = function (event) {
            if ($scope.mouseDown) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                var md = 99999999; // minimal distance hour from our mouse
                var hourToSelect = null;
                var hours = angular.element(document.querySelectorAll(".hour"));

                angular.forEach(hours, function (elem) {
                    var pos = elem.getBoundingClientRect();
                    var distance = Math.floor(Math.sqrt(Math.pow(mouseX - (pos.left + (elem.offsetWidth / 2)), 2) + Math.pow(mouseY - (pos.top + (elem.offsetHeight / 2)), 2)));
                    if (distance < md) {
                        md = distance
                        hourToSelect = elem.text;
                    }
                });

                $scope.setTime(+hourToSelect);
            }
        };

        $scope.changeClockMode = function (mode) {
            $scope.minuteMode = mode == "m";
            init();
        };

        $scope.setTime = function (val) {
            if (!$scope.minuteMode) {
                $scope.selected.hour = val;
                rotateClockLine();
            } else {
                $scope.selected.minute = val;
                rotateClockLine();
            }
        };

        $scope.isTimeSelected = function (val) {
            if (val == 12 && $scope.minuteMode) {
                val = 0;
            } else if (val == 0 && !$scope.minuteMode) {
                val = 12;
            }

            return $scope.minuteMode
                ? val === $scope.selected.minute
                : val === $scope.selected.hour;
        };

        $scope.ok = function () {
            if ($scope.minuteMode) {
                var dayRange = $scope.isPM ? "PM" : "AM";
                var minToDisplay = $scope.selected.minute.toString().length == 1 ? "0" + $scope.selected.minute : $scope.selected.minute;

                $uibModalInstance.close({
                    time: $scope.time.time,
                    display: $scope.selected.hour + ":" + minToDisplay + " " + dayRange,
                });
            } else {
                $scope.changeClockMode("m");
            }
        };

        $scope.cancel = function () {
            if ($scope.minuteMode) {
                $scope.changeClockMode("h");
            } else {
                $uibModalInstance.dismiss('cancel');
            }            
        };
    });

})();