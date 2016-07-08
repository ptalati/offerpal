(function () {
    var app = angular.module('user-controller', ['angular-loading-bar']);

    app.controller('UserController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state', '$location',
        function ($window, $scope, $http, $log, $scope, baseUrl, $state, $location) {
            $scope.users = [];
            $scope.user = {};
            $scope.userTypes = [];
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.verificationComplete = false;
        	$scope.offset = 0;
        	$scope.pageSize = 20;
        	$scope.showNext = true;
        	$scope.showPrev = false;

            $scope.fetchUserTypes = function() {
                $http.get(baseUrl + "api/common/usertypes").then(function (results) {
        		    $scope.userTypes = results.data;
		        });
            };

            $scope.fetchUsers = function() {
                $http.get(baseUrl + "api/user?token=" + $scope.token.Token + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).then(function (results) {
        		    $scope.users = results.data;
        		    
        		    if ($scope.users.length < $scope.pageSize) $scope.showNext = false;
		        });
            };

            $scope.fetchUser = function(userId) {
                $http.get(baseUrl + "api/user?token=" + $scope.token.Token + "&id=" + userId).then(function (results) {
        		    $scope.user = results.data;
		        });
            };
            
            $scope.verifyUser = function(emailToken) {
				console.log($state.params.emailToken);
				
            	$http.get(baseUrl + "api/account/verify?emailToken=" + encodeURIComponent(emailToken)).then(function (results) {
        		    $scope.verificationComplete = results.data;
		        });
            }
            
            $scope.saveUser = function(user) {
        		$http.post(baseUrl + "api/user?token=" + $scope.token.Token, JSON.stringify(user)).then(function (results) {
            		$scope.user = results.data;
        		    
        		    $state.go('admin.user', {categoryId: $scope.user.Id});

                    $scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };

            $scope.loadDefault = function () {
                $scope.fetchUsers();
                
                if ($state.params.userId) {
                	$scope.fetchUserTypes();
                	
                	if ($state.params.userId > 0) {
                		$scope.fetchUser($state.params.userId);
                	}
                }
            };
            
            $scope.loadFrontDefault = function() {
            	console.log("Email token sent");
            	if ($state.params.emailToken) {
            		if ($location.path().indexOf("verify") !== -1) {
            			$scope.page.setTitle('Verify Email Address');
            			
            			$scope.verifyUser($state.params.emailToken);
            		}
                }
            };
            
            $scope.resendEmail = function(user) {
            	$http.post(baseUrl + "api/account/resend?token=" + $scope.token.Token, JSON.stringify(user)).then(function (results) {
            		$scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };
            
            $scope.resetPassword = function(email) {
            	$http.post(baseUrl + "api/account/reset?email=" + email).then(function (results) {
            		$scope.success = {
                        Status: true,
                        Message: 'Reset password email has been sent.'
                    };
		        });
            };
            
            $scope.forgotPassword = function(forgotpassword) {
            	$scope.resetPassword(forgotpassword.Email);
            };
            
            $scope.changePassword = function(reset) {
            	$http.post(baseUrl + "api/account/changepassword?emailToken=" + encodeURIComponent($state.params.emailToken) + "&password=" + reset.Password).then(function (results) {
            		$scope.success = {
                        Status: true,
                        Message: 'Your password has been updated, please try login again.'
                    };
		        });
            };
            
            $scope.fetchNextAdmin = function() {
            	$scope.offset = $scope.offset + 1;
            	
            	console.log($scope.offset);
            	
            	$http.get(baseUrl + "api/user?token=" + $scope.token.Token + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
            			$scope.users = results;
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
            	
            	$http.get(baseUrl + "api/user?token=" + $scope.token.Token + "&offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
	        		    $scope.users = results;
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