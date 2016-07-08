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
        	$scope.offset = 0;
        	$scope.showMore = true;
        	$scope.pageSize = 20;
        	$scope.showNext = true;
        	$scope.showPrev = false;

            $scope.fetchOffers = function(categoryId, storeId) {
            	categoryId = categoryId || 0;
            	storeId = storeId || 0;
            	
                $http.get(baseUrl + "api/offer?categoryId=" + categoryId + "&storeId=" + storeId).then(function (results) {
        		    $scope.offers = results.data;
		        });
            };

            $scope.fetchCategoriesAll = function() {
                $http.get(baseUrl + "api/category/all?offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).then(function (results) {
        		    $scope.categories = results.data;
        		    
        		    if ($scope.categories.length < $scope.pageSize) $scope.showNext = false;
		        });
            };

            $scope.fetchCategories = function() {
                $http.get(baseUrl + "api/category?pageSize=-1").then(function (results) {
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
                $scope.fetchCategoriesAll();
                
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
            
            $scope.fetchNextOffers = function() {
            	$scope.offset = $scope.offset + 1;
            	
            	console.log($scope.offset);
            	
            	$http.get(baseUrl + "api/offer?categoryId=" + $scope.category.Id + "&offset=" + $scope.offset).then(function (results) {
            		if (results.data.length > 0) {
	        		    $.each(results.data, function(index, value) {
	        		    	$scope.offers.push(value);
	        		    });
            		} else {
            			$scope.showMore = false;
            		}
		        });
            };
            
            $scope.fetchNextAdmin = function() {
            	$scope.offset = $scope.offset + 1;
            	
            	console.log($scope.offset);
            	
            	$http.get(baseUrl + "api/category/all?offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
            			$scope.categories = results;
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
            	
            	$http.get(baseUrl + "api/category/all?offset=" + $scope.offset + "&pageSize=" + $scope.pageSize).success(function (results) {
            		console.log(results.length);
            		
            		if (results.length > 0) {
	        		    $scope.categories = results;
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