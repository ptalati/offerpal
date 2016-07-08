(function () {
    var app = angular.module('register-controller', ['angular-loading-bar']);

    app.controller('RegisterController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.register = {};
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.ipAddress = '';

            $scope.registerUser = function (register) {
                $scope.error = {
                    Status: false,
                    Message: ''
                };
                $scope.success = {
                    Status: false,
                    Message: ''
                };

                $http.post(baseUrl + "api/account/register?email=" + register.Email, JSON.stringify(register)).success(function (result) {
                    $scope.success = {
                        Status: true,
                        Message: 'Registration completed. Please verify your account and login.'
                    };
                    
                    $state.go("registered");

                    console.log("User created.");
                }).error(function (data, status, headers, config) {
                	$scope.error = {
                        Status: true,
                        Message: data.ExceptionMessage
                    };
                	
                    console.log("Error [user create] - " + status);
                });
            };

            $scope.getClientIPAddress = function() {
                $.getJSON("http://jsonip.com/?callback=?", function (data) {
                    console.log(data);
                    $scope.ipAddress = data.ip;
                });
            };

            $scope.getClientIPAddress();
        }
    ]);
})();