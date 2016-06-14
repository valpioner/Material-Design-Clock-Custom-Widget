(function () {
    "use strict";

    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("time");

        $stateProvider
            .state('time', {
                url: "/time",
                templateUrl: 'app/time/time.html',
                controller: 'timeCtrl',
                controllerAs: 'vm',
            })

    });

})();