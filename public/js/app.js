/**
 * Created by beeven on 7/7/14.
 */

"use strict";

var CheckpointNoticeApp = angular.module('CheckpointNoticeApp', [
    'ngAnimate',
    'ngRoute',
    'NoticeServices',
    'NoticeControllers',
    'NoticeDirectives',
    'infinite-scroll'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/:filter", {
        templateUrl: "partials/statusList.html"
    })
        .otherwise({
            templateUrl: "partials/statusList.html"
        });

   // $locationProvider.html5Mode(true);
});

var NoticeServices = angular.module("NoticeServices", []);
var NoticeControllers = angular.module("NoticeControllers", ['NoticeServices']);
var NoticeDirectives = angular.module("NoticeDirectives",[]);

NoticeControllers.controller("MainController", ['$scope', '$http', '$routeParams', '$location', 'pollService', function ($scope, $http, $routeParams, $location, pollService) {
    var globalFilter = $routeParams.filter;


    $scope.statusItems = [];
    $scope.filterText = globalFilter;
    $scope.filterApplied = !!globalFilter;

    $scope.busy = true;

    var updateStatusItems = function (data) {
        for (var index = 0; index < data.length; index++) {
            $scope.statusItems.unshift(data[index]);
        }
    };


    pollService.fetch(0, globalFilter).then(function (data) {
        $scope.statusItems = data;
        if (!globalFilter) {
            pollService.on("data", updateStatusItems);
            pollService.start();
        }
        $scope.busy = false;
    });





    $scope.loadMoreItems = function () {
        $scope.busy = true;
        pollService.fetch($scope.statusItems.length,globalFilter)
            .then(function (data) {
                $scope.statusItems = $scope.statusItems.concat(data);
                $scope.busy = false;
            });
    };

    $scope.filterSubmit = function () {
        pollService.stop();
        if (!globalFilter) {
            $location.path("/" + $scope.filterText.toUpperCase());
        } else {
            $location.path("/");
        }

    };
}]);

function PollService($q, $http, loopInterval) {

    var lastRecordId;
    var loopHandler;
    var started = false;

    var listeners = {};

    var events = ["data", "error"];
    this.events = events;
    this.listeners = listeners;
    var that = this;
    for (var index = 0; index < events.length; index++) {
        listeners[events[index]] = [];
    }

    var loopFunction = function () {
        $http.get("api/currentList/allFrom/" + lastRecordId)
            .success(function (data) {
                if (data != null && typeof(data) !== 'undefined' && data.length > 0) {
                    lastRecordId = data[0].Id;
                }
                ondata(data);
            })
            .error(function (err) {
            });
    };


    this.start = function () {
        if (!started) {
            that.fetch(0).then(function (data) {
                lastRecordId = data[0].Id;
                loopHandler = setInterval(loopFunction, loopInterval);
                started = true;
            });
        }
    };
    this.stop = function () {
        if (started) {
            clearInterval(loopHandler);
            started = !started;
        }
    };
    this.fetch = function (index, filter) {
        var deferred = $q.defer();
        var params = null;
        if(filter!=null && typeof(filter)!=='undefined') {
            params = {filter: filter};
        }
        $http.get("api/currentList/" + index, {params: params})
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.addListener = function (event, listener) {
        if (events.indexOf(event) != -1) {
            listeners[event].push(listener);
        }
        return this;
    };

    this.on = function (event, listener) {
        if (events.indexOf(event) != -1) {
            if (listeners[event].indexOf(listener) == -1) {
                listeners[event].push(listener);
            }
        }
        return this;
    };

    this.removeListener = function (event, listener) {
        if (events.indexOf(event) != -1) {
            var index = listeners[event].indexOf(listener);
            if (index != -1) {
                listeners[event].splice(index, 1);
            }
        }
        return this;
    };

    this.off = function (event, listener) {
        if (events.indexOf(event) != -1) {
            if (listener == null || typeof(listener) === 'undefined') {
                listeners[event] = [];
            }
            else {
                var index = listeners[event].indexOf(listener);
                if (index != -1) {
                    listeners[event].splice(index, 1);
                }
            }
        }
        return this;
    };

    var ondata = function (data) {
        for (var index = 0; index < listeners["data"].length; index++) {
            listeners["data"][index].apply(this, [data]);
        }
    };

    var onerror = function (err) {

    };
}

NoticeServices.provider("pollService", function PollingServiceProvider() {
    var loopInterval = 20000;
    this.setLoopInterval = function (value) {
        loopInterval = parseInt(value);
    };

    this.$get = ["$q", "$http", function pollServiceFactory($q, $http) {
        return new PollService($q, $http, loopInterval);
    }];
});

NoticeDirectives.directive("loadingCircular",function(){
    return {
        restrict: 'AEC',
        template: '<div class="circular"></div><div class="circular"></div><div class="circular"></div><div class="circular"></div><div class="circular"></div><div class="circular"></div><div class="circular"></div><div class="circular"></div>'
    }
});
