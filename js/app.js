(function () {
    var app = angular.module('offerpal', [
      'ngRoute',
      'ngResource',
      'ui.router', 
      'ngSanitize',
      'angular-loading-bar',
      'pageslide-directive',
      'ngFileUpload',
      'login-controller',
      'register-controller',
      'category-controller',
      'store-controller',
      'offer-controller',
      'user-controller',
      'jqdatepicker',
      'category-filter',
      'product-template',
      'product-type-template'
  	]);

    //app.constant('baseUrl', 'http://localhost:402/');
    //app.constant('baseUrl', 'http://localhost:51096/');
    app.constant('baseUrl', 'http://api.offerpal.in/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));
    
    app.config([
        'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="data:image/png;base64,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" /> Loading...</div></div>';
        }
    ]);

    app.config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state("welcome", {
            	title: 'Offerpal - Your Cashback Buddy',
                url: "/",
                templateUrl: 'templates/home.html'
            }).state("login", {
                url: "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            }).state("logout", {
                url: "/logout",
                template: 'Logout',
                controller: function ($scope, baseUrl, $state, $rootScope) {
                    $scope.loadDefault = function () {
                        if (localStorage["offerpal_token"]) {
                            localStorage.removeItem("offerpal_token");
                            localStorage.removeItem("token");
                            
                            $rootScope.token = null;
                            
                            $state.go("login");
                        }
                    };

                    $scope.loadDefault();
                }
            }).state("register", {
                url: "/register",
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            }).state("register.complete", {
                url: "/complete",
                templateUrl: 'templates/register.complete.html'
            }).state("admin", {
                url: "/admin",
                templateUrl: 'templates/admin.html',
                controller: function ($scope, baseUrl, $state) {
                	if (!localStorage["offerpal_token"]) {
                        $state.go('login');
                    }
                }
            }).state("admin.categories", {
                url: "/categories",
                templateUrl: 'templates/admin.categories.html',
            }).state("admin.category", {
                url: "/categories/c/:categoryId",
                templateUrl: 'templates/admin.category.html',
            }).state("admin.stores", {
                url: "/stores",
                templateUrl: 'templates/admin.stores.html',
            }).state("admin.store", {
                url: "/stores/s/:storeId",
                templateUrl: 'templates/admin.store.html',
            }).state("admin.offers", {
                url: "/offers",
                templateUrl: 'templates/admin.offers.html',
            }).state("admin.offer", {
                url: "/offers/o/:offerId",
                templateUrl: 'templates/admin.offer.html',
            }).state("admin.users", {
                url: "/users",
                templateUrl: 'templates/admin.users.html',
            }).state("admin.user", {
                url: "/users/u/:userId",
                templateUrl: 'templates/admin.user.html',
            }).state("category", {
                url: "/category/:categorySlug",
                templateUrl: 'templates/category.html'
            }).state("store", {
                url: "/store/:storeSlug",
                templateUrl: 'templates/store.html'
            }).state("stores", {
                url: "/stores",
                templateUrl: 'templates/stores.html'
            }).state("offer", {
                url: "/offer/:offerSlug",
                templateUrl: 'templates/offer.html'
            }).state("redirectstore", {
                url: "/redirect/store/:storeId",
                templateUrl: 'templates/redirect.store.html',
                controller: function ($scope, baseUrl, $state) {
                	if (!localStorage["offerpal_token"]) {
                        $state.go('login');
                    }
                }
            }).state("redirectoffer", {
                url: "/redirect/offer/:offerId",
                templateUrl: 'templates/redirect.offer.html',
                controller: function ($scope, baseUrl, $state) {
                	if (!localStorage["offerpal_token"]) {
                        $state.go('login');
                    }
                }
            });

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                
                $state.go("welcome");

                /*if (!localStorage["offerpal_token"]) {
                    $state.go('login');
                } else {
                    $state.go("welcome");
                }*/
            });
        }
    ]);
    
    app.run(['$rootScope', function($rootScope) {
        $rootScope.page = {
            setTitle: function(title) {
                this.title = title + ' - Offerpal';
            }
        }

        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
            $rootScope.page.setTitle(current.$$route.title || 'Default Title');
        });
    }]);

	app.controller('RootController', [
        '$scope', '$http', '$log', '$interval', '$rootScope', 'baseUrl', 'isMobile', '$location', '$window', '$sce', '$state', 
        function ($scope, $http, $log, $interval, $rootScope, baseUrl, isMobile, $location, $window, $sce, $state) {
        	$scope.categories = [];
        	$scope.stores = [];
        	$scope.offers = [];
        	$scope.featuredOffers = [];
        	$scope.token = null;
        	$scope.mobile = isMobile;
        	$scope.menu = false;
        	$scope.actionMenu = false;
        	
	        $scope.fetchCategories = function() {
	        	$http.get(baseUrl + "api/category").then(function (results) {
        		    $scope.categories = results.data;
		        });
	        };
        	
	        $scope.fetchStores = function() {
	        	$http.get(baseUrl + "api/store").then(function (results) {
        		    $scope.stores = results.data;
        		    
        		    $scope.refreshSlider();
		        });
	        };
        	
	        $scope.fetchOffers = function() {
	        	$http.get(baseUrl + "api/offer").then(function (results) {
        		    $scope.offers = results.data;
		        });
	        };
        	
	        $scope.fetchFeaturedOffers = function() {
	        	$http.get(baseUrl + "api/offer/featured").then(function (results) {
        		    $scope.featuredOffers = results.data;
		        });
	        };
	        
	        $scope.fetchUser = function () {
                if (localStorage.getItem("offerpal_token")) {
                    $rootScope.token = JSON.parse(localStorage.getItem("offerpal_token"));
                }
            };
	        
	        $scope.loadData = function() {
	        	$scope.fetchCategories();
	        	$scope.fetchStores();
	        	$scope.fetchOffers();
	        	$scope.fetchFeaturedOffers();
	        	$scope.fetchUser();
	        };
	        
	        $rootScope.$watch('token', function(newVal, oldVal) {
	        	if (typeof $rootScope.token !== "undefined") $scope.token = $rootScope.token;
	        	else $scope.token = null;
	        	
                console.log("Token - " + $scope.token);
                console.log($scope.token);
            }, true);
	         
	        $scope.showDropDown = function(parentId) {
        		var count = 0;
	        	 
    			$.each($scope.categories, function(index, value) {
    				if (value.Parent.Id === parentId) count++;
	        	});
	        	 
	        	return count;
	        };
	         
	        $scope.getUserDisplayName = function(user) {
	        	if (typeof user === "undefined") return;
	        	
                return user.FirstName + ' ' + user.LastName;
            };

            $rootScope.imageLoad = function (file) {
                return baseUrl + "Uploads/" + file;
            };
            
            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');
                console.log($location.path());
                
                if ($location.path() === '/' || $location.path().indexOf("admin") !== -1) $scope.page.setTitle('Cashback Offers, Discount Coupons, Best Online Deals');

                $scope.loadData();
            });
            
            $scope.refreshSlider = function() {
            	$('#featured-stores').lightSlider({
                    item: 5,
                    auto: false,
                    loop: false,
                    pauseOnHover: true,
                    slideMove: 2,
                    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                    speed: 600,
                    responsive: [
                        {
                            breakpoint: 800,
                            settings: {
                                item: 3,
                                slideMove: 1,
                                slideMargin: 6,
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                item: 2,
                                slideMove: 1
                            }
                        }
                    ]
                });
            };
            
            $scope.renderHtml = function(html_code) {
                return $sce.trustAsHtml(html_code);
            };
            
            $scope.toggleMenu = function() {
            	$scope.menu = !$scope.menu;
            };
            
            $scope.toggleActionMenu = function() {
            	$scope.actionMenu = !$scope.actionMenu;
            };
	    }
	]);
})();