(function () {
    var app = angular.module('activity-controller', ['angular-loading-bar']);

    app.controller('ActivityController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state',  
        function ($window, $scope, $http, $log, $scope, baseUrl, $state) {
            $scope.activities = [];
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };

            $scope.fetchActivities = function(user) {
            	user = user || false;
            	
                $http.get(baseUrl + "api/activity?token=" + $scope.token.Token + "&user=" + user).then(function (results) {
        		    $scope.activities = results.data;
		        });
            };

            $scope.loadDefault = function () {
                $scope.fetchActivities();
            };

            $scope.loadFrontDefault = function () {
                $scope.fetchActivities(true);
                
                $scope.page.setTitle("Activities");
            };
            
            $scope.formatDateTime = function(dateTime) {
            	return dateTime.replace("T", " ");
            }
        }
    ]);
})();