(function () {
    var app = angular.module('user-controller', ['angular-loading-bar']);

    app.controller('UserController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state',  
        function ($window, $scope, $http, $log, $scope, baseUrl, $state) {
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
            
            $scope.resendEmail = function(user) {
            	$http.post(baseUrl + "api/account/resend?token=" + $scope.token.Token, JSON.stringify(user)).then(function (results) {
            		$scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };
        }
    ]);
})();