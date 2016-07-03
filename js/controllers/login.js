(function () {
    var app = angular.module('login-controller', ['angular-loading-bar']);

    app.controller('LoginController', [
        '$window', '$scope', '$http', '$log', '$rootScope', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, $rootScope, baseUrl, $state) {
            $scope.login = {
	    		"Email": "",
	    		"Password": ""
            };
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.ipAddress = '';

            $scope.loginUser = function (login) {
                $scope.error = {
                    Status: false,
                    Message: ''
                };
                $scope.success = {
                    Status: false,
                    Message: ''
                };

                $http.post(baseUrl + "api/account/login?email=" + login.Email, JSON.stringify(login)).success(function (result) {
                	if (result.Id > 0) {
                		if (result.User.EmailConfirmed) {
		                    $scope.success = {
		                        Status: true,
		                        Message: 'Welcome to Offerpal!'
		                    };
		
		                    localStorage.setItem("offerpal_token", JSON.stringify(result));
		                    $rootScope.token = result;
		                    
		                    console.log("User logged in.");
		
		                    $state.go("welcome");
                		} else {
                			$scope.error = {
                                Status: true,
                                Message: "Please follow the link provided in email to verify your account before login. If you have not received the email, please <a href='javascript:void(0);' ng-click='resendEmail()'>click here</a> to resend the verification email."
                            };
                		}
                	} else {
                		$scope.error = {
                            Status: true,
                            Message: "Invalid username and password combination."
                        };
                	}
                }).error(function (data, status, headers, config) {
                	$scope.error = {
                        Status: true,
                        Message: data.ExceptionMessage
                    };
            		
                    console.log("Error [user login] - " + status);
                });
            };

            $scope.getClientIPAddress = function () {
                $.getJSON("http://jsonip.com/?callback=?", function (data) {
                    console.log(data);
                    $scope.ipAddress = data.ip;
                });
            };

            $scope.loadDefault = function () {
                //localStorage.clear();
                console.log(localStorage);

                if (localStorage.getItem("offerpal_token")) {
                    $scope.success = {
                        Status: true,
                        Message: 'You are already logged in!'
                    };

                    $state.go("welcome");
                }
            };

            $scope.getClientIPAddress();
            $scope.loadDefault();
        }
    ]);
})();