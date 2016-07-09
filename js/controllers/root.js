(function () {
    var app = angular.module('root-controller', ['angular-loading-bar']);

	app.controller('RootController', [
        '$scope', '$http', '$log', '$interval', '$rootScope', 'baseUrl', 'webUrl', 'isMobile', '$location', '$window', '$sce', '$state', '$timeout', 
        function ($scope, $http, $log, $interval, $rootScope, baseUrl, webUrl, isMobile, $location, $window, $sce, $state, $timeout) {
        	$scope.categories = [];
        	$scope.token = null;
        	$scope.mobile = isMobile;
        	$scope.menu = false;
        	$scope.actionMenu = false;
        	$scope.counter = 5;
        	$scope.balance = {};
        	
        	$scope.$on('cfpLoadingBar:completed', function () {
                console.log('Loading Finished');
                
                if ($location.path() === "/" || $location.path() === "") {
                	$scope.refreshSlider();
                }
            });
        	
	        $scope.fetchCategories = function() {
	        	$http.get(baseUrl + "api/category?pageSize=-1").then(function (results) {
        		    $scope.categories = results.data;
		        });
	        };
	        
	        $scope.fetchUser = function () {
                if (localStorage.getItem("offerpal_token")) {
                    $rootScope.token = JSON.parse(localStorage.getItem("offerpal_token"));
                }
            };
	        
	        $scope.fetchBalance = function () {
	        	console.log($rootScope.token);
	        	
                if ($rootScope.token !== null) {
                	$http.get(baseUrl + "api/account/balance?token=" + $rootScope.token.Token).then(function (results) {
            		    $scope.balance = results.data;
    		        });
                } else {
                	$scope.balance = {
            			"PendingPoints": 0.0,
            			"AvailablePoints": 0.0
        			};
                }
            };
	        
	        $scope.loadData = function() {
	        	$scope.fetchCategories();
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
            	if (typeof file === "undefined") return;
            	
                return baseUrl + "Uploads/" + file;
            };

            $rootScope.logoLoad = function (file) {
            	if (typeof file === "undefined") return;
            	
                return webUrl + "images/" + file;
            };
            
            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');
                console.log($location.path());
                
                if ($location.path() === '/' || $location.path().indexOf("admin") !== -1) $scope.page.setTitle('Cashback Offers, Discount Coupons, Best Online Deals');
                if ($location.path().indexOf("redirect") !== -1) var countDown = $timeout($scope.onCountDown,1000);
                if ($location.path() === "/" || $location.path() === "") $scope.fetchBalance();
            });
            
            $scope.refreshSlider = function() {
            	console.log("Slider created");
            	
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
            
            $scope.redirecToOfer = function(offer) {
            	if (!localStorage["offerpal_token"]) {
            		return $state.href('login');
            	}
            	
            	return webUrl + $state.href('redirectoffer', {offerId: offer.Id, token: $scope.token.Token});
            };
            
            $scope.redirecToStore = function(store) {
            	if (!localStorage["offerpal_token"]) {
            		return $state.href('login');
            	}
            	
            	return webUrl + $state.href('redirectstore', {storeId: store.Id, token: $scope.token.Token});
            };
        	
            $scope.onCountDown = function(){
                $scope.counter--;
                
                countDown = $timeout($scope.onCountDown, 1000);
            };

            $scope.stop = function(){
                $timeout.cancel(countDown);
            };
            
            $scope.$watch('counter', function (newVal, oldVal) {
            	if ($scope.counter === 0) {
            		$scope.stop();
            		
            		$scope.redirectUrl();
            	}
            }, true);
            
            $scope.redirectUrl = function() {
            	var redirectParam = "";
            	
            	console.log($state.params.offerId);
            	console.log($state.params.storeId);
            	
            	if (typeof $state.params.offerId !== "undefined") redirectParam = "&offerId=" + $state.params.offerId;
        		if (typeof $state.params.storeId !== "undefined") redirectParam = "&storeId=" + $state.params.storeId;
            	
            	$http.get(baseUrl + "api/account/redirect?token=" + $state.params.token + redirectParam).then(function (results) {
        		    window.location = results.data;
		        });
            };
            
            $scope.generateSlug = function(str) {
            	var $slug = '';
                var trimmed = $.trim(str);
                
                $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                
                return $slug.toLowerCase();
            };
	    }
	]);
})();