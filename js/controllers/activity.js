(function () {
    var app = angular.module('activity-controller', ['angular-loading-bar']);

    app.controller('ActivityController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state', 'ngDialog',  
        function ($window, $scope, $http, $log, $scope, baseUrl, $state, ngDialog) {
            $scope.activities = [];
            $scope.activity = {};
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.acceptActivityShow = false;

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
            
            $scope.acceptActivity = function(a) {
            	$scope.acceptActivityShow = true;
            	$scope.activity = a;
            };
            
            $scope.saveActivity = function(activity) {
            	var transaction = {
            		User: {
            			Id: activity.User.Id
            		},
            		Activity: {
            			Id: activity.Id
            		},
            		RewardPoint: activity.RewardPoint,
            		EstimatedDate: activity.EstimatedDate
            	};
            	
            	$http.post(baseUrl + "api/transaction?token=" + $scope.token.Token, JSON.stringify(transaction)).success(function (results) {
            		$scope.acceptActivityShow = false;
		        }).error(function (data, status, headers, config) {
		        	$scope.error = {
                        Status: true,
                        Message: data.ExceptionMessage
                    };
            		
                    console.log("Error [save transaction] - " + status);
                });
            };
        }
    ]);
})();