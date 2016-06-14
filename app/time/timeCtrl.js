(function () {
    "use strict";

    var appModule = angular.module('app');

    appModule.controller('timeCtrl', function ($scope, $uibModal) {
        $scope.header = "Custom TimePicker";

        var date1 = new Date(2015, 2, 4, 23, 5, 0, 0);
        var date2 = new Date(2015, 2, 4, 15, 45, 0, 0);
        var date3 = new Date(2015, 2, 4, 9, 25, 0, 0);
        
        $scope.timeBoxes = [
            {
                time: date1,
                display: displayFormat(date1)
            },
            {
                time: date2,
                display: displayFormat(date2)
            },
            {
                time: date3,
                display: displayFormat(date3)
            }
        ]

        function displayFormat(date) {
            var isPM = date.getHours() > 12;
            var timeRange = isPM ? " PM" : " AM";
            var h = isPM ? date.getHours() - 12 : date.getHours();

            return h + ":" + (date.getMinutes().toString().length == 1 ? "0" + date.getMinutes() : date.getMinutes()) + timeRange;
        }

        $scope.open = function (activeBoxIndex) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/time/timePickerWidget.html',
                controller: 'timePickerWidgetCtrl',
                controllerAs: 'vm',
                windowClass: 'modal-window',
                resolve: {
                    time: function () {
                        return $scope.timeBoxes[activeBoxIndex];
                    }
                }
            });

            modalInstance.result.then(function (newTime) {
                $scope.timeBoxes[activeBoxIndex] = newTime;
            }, function () {
                //pressed 'Cancel' -> modal dismissed
            });
        };

    });

})();