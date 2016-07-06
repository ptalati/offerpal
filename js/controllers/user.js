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

            $scope.fetchUserTypes = function() {
                $http.get(baseUrl + "api/common/usertypes").then(function (results) {
        		    $scope.userTypes = results.data;
		        });
            };

            $scope.fetchUsers = function() {
                $http.get(baseUrl + "api/user?token=" + $scope.token.Token).then(function (results) {
        		    $scope.users = results.data;
		        });
            };

            $scope.fetchUser = function(userId) {
                $http.get(baseUrl + "api/user?token=" + $scope.token.Token + "&id=" + userId).then(function (results) {
        		    $scope.user = results.data;
		        });
            };
            
            $scope.verifyUser = function(emailToken) {
            	$http.get(baseUrl + "api/account/verify?emailToken=" + emailToken).then(function (results) {
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
            	$http.post(baseUrl + "api/account/changepassword?emailToken=" + $state.params.emailToken + "&password=" + reset.Password).then(function (results) {
            		$scope.success = {
                        Status: true,
                        Message: 'Your password has been updated, please try login again.'
                    };
		        });
            };
        }
    ]);
})();