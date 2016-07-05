(function () {
    var app = angular.module('category-controller', ['angular-loading-bar']);

    app.controller('CategoryController', [
        '$window', '$scope', '$http', '$log', '$rootScope', 'baseUrl', '$state', 
        function ($window, $scope, $http, $log, $rootScope, baseUrl, $state) {
            $scope.categories = [];
            $scope.category = {};
            $scope.offers = [];
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };

            $scope.fetchOffers = function(categoryId, storeId) {
            	categoryId = categoryId || 0;
            	storeId = storeId || 0;
            	
                $http.get(baseUrl + "api/offer?categoryId=" + categoryId + "&storeId=" + storeId).then(function (results) {
        		    $scope.offers = results.data;
		        });
            };

            $scope.fetchCategories = function() {
                $http.get(baseUrl + "api/category/all").then(function (results) {
        		    $scope.categories = results.data;
		        });
            };

            $scope.fetchCategory = function(categoryId) {
                $http.get(baseUrl + "api/category?id=" + categoryId).then(function (results) {
        		    $scope.category = results.data;
		        });
            };

            $scope.fetchCategoryBySlug = function(categorySlug) {
                $http.get(baseUrl + "api/category?slug=" + categorySlug).then(function (results) {
        		    $scope.category = results.data;
        		    
        		    $scope.fetchOffers($scope.category.Id);
        		    $scope.page.setTitle($scope.category.Name);
		        });
            };
            
            $scope.saveCategory = function(category) {
            	$http.post(baseUrl + "api/category?token=" + $rootScope.token.Token, JSON.stringify(category)).then(function (results) {
        		    $scope.category = results.data;
        		    
        		    $state.go('admin.category', {categoryId: $scope.category.Id});

                    $scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };

            $scope.loadDefault = function () {
                $scope.fetchCategories();
                
                console.log($state.params.categoryId);
                
                if ($state.params.categoryId > 0) {
                	$scope.fetchCategory($state.params.categoryId);
                }
            };
            
            $scope.loadFrontDefault = function() {
            	$scope.fetchCategoryBySlug($state.params.categorySlug);
            };
            
            $scope.$watch('category.Name', function (newVal, oldVal) {
            	if (typeof $scope.category.Name === "undefined") return;
            	
            	$scope.category.Slug = $scope.generateSlug($scope.category.Name);
            }, true);
        }
    ]);
})();