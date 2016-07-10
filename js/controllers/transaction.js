(function () {
    var app = angular.module('transaction-controller', ['angular-loading-bar']);

    app.controller('TransactionController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state', 'ngDialog',  
        function ($window, $scope, $http, $log, $scope, baseUrl, $state, ngDialog) {
            $scope.transactions = [];
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
            	
                $http.get(baseUrl + "api/transaction?token=" + $scope.token.Token + "&user=" + user).then(function (results) {
        		    $scope.transactions = results.data;
		        });
            };

            $scope.loadDefault = function () {
                $scope.fetchActivities();
            };

            $scope.loadFrontDefault = function () {
                $scope.fetchActivities(true);
                
                $scope.page.setTitle("Transactions");
            };
            
            $scope.formatDateTime = function(dateTime) {
            	return dateTime.replace("T", " ");
            };
            
            $scope.deleteTransaction = function(transaction) {
            	if (confirm("Do you want to delete?")) {
            		$http.post(baseUrl + "api/transaction/delete?token=" + $scope.token.Token + "&transactionId=" + transaction.Id).then(function (results) {
            			$scope.transactions.splice($.inArray(transaction, $scope.transactions), 1);
    		        });
            	}
            };
            
            $scope.acceptTransaction = function(transaction) {
            	if (confirm("Do you want to accept?")) {
            		$http.post(baseUrl + "api/transaction/accept?token=" + $scope.token.Token + "&transactionId=" + transaction.Id).success(function (results) {
            			console.log("Transaction accepted");
            			
            			transaction.Status = {
            				"Id": 2,
            				"Name": "Available"
            			};
            			
            			$scope.success = {
                            Status: true,
                            Message: "Transaction accepted."
                        };
    		        }).error(function (data, status, headers, config) {
    		        	$scope.error = {
	                        Status: true,
	                        Message: data.ExceptionMessage
	                    };
	            		
	                    console.log("Error [accept transaction] - " + status);
	                });
            	}
            };
            
            $scope.rejectTransaction = function(transaction) {
            	if (confirm("Do you want to reject?")) {
            		$http.post(baseUrl + "api/transaction/reject?token=" + $scope.token.Token + "&transactionId=" + transaction.Id).success(function (results) {
            			console.log("Transaction rejected");
            			
            			transaction.Status = {
            				"Id": 3,
            				"Name": "Rejected"
            			};
            			
            			$scope.success = {
                            Status: true,
                            Message: "Transaction rejected."
                        };
    		        }).error(function (data, status, headers, config) {
    		        	$scope.error = {
	                        Status: true,
	                        Message: data.ExceptionMessage
	                    };
	            		
	                    console.log("Error [reject transaction] - " + status);
	                });
            	}
            };
        }
    ]);
})();