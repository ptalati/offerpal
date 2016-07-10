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
        	$scope.offset = 0;
        	$scope.pageSize = 20;
        	$scope.showNext = true;
        	$scope.showPrev = false;

            $scope.fetchActivities = function(user) {
            	user = user || false;
            	
                $http.get(baseUrl + "api/activity?token=" + $scope.token.Token + "&user=" + user + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).then(function (results) {
        		    $scope.activities = results.data;
        		    
        		    if ($scope.activities.length < $scope.pageSize) $scope.showNext = false;
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
            		
            		$scope.success = {
                        Status: true,
                        Message: "Activity accepted and transaction record created."
                    };
		        }).error(function (data, status, headers, config) {
		        	$scope.error = {
                        Status: true,
                        Message: data.ExceptionMessage
                    };
            		
                    console.log("Error [save transaction] - " + status);
                });
            };
            
            $scope.fetchNextAdmin = function() {
            	$scope.offset = $scope.offset + 1;
            	
            	console.log($scope.offset);
            	
            	$http.get(baseUrl + "api/activity?token=" + $scope.token.Token + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
            			$scope.activities = results;
            		}
            		
            		if (results.length > 0 && results.length == $scope.pageSize) {
            			$scope.showNext = true;
            		} else {
            			$scope.showNext = false;
            		}
		        }).error(function (data, status, headers, config) {
		        	$scope.offset = $scope.offset - 1;
		        });
            };
            
            $scope.fetchPreviousAdmin = function() {
            	$scope.offset = $scope.offset - 1;
            	$scope.showNext = true;
            	
            	console.log($scope.offset);
            	
            	$http.get(baseUrl + "api/activity?token=" + $scope.token.Token + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
	        		    $scope.activities = results;
            		}
		        }).error(function (data, status, headers, config) {
		        	$scope.offset = $scope.offset + 1;
		        });
            };
            
            $scope.$watch('offset', function (newVal, oldVal) {
            	if ($scope.offset > 0) $scope.showPrev = true;
            	else $scope.showPrev = false;
            }, true);
        }
    ]);
})();