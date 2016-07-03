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
            cfpLoadingBarProvider.includeSpinner = false;
            //cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="/images/logo.png" /> Loading...</div></div>';
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