(function () {
    var app = angular.module('offerpal', [
      'ngRoute',
      'ngResource',
      'ui.router', 
      'ngSanitize',
      'ngDialog',
      'textAngular',
      'angular-loading-bar',
      'pageslide-directive',
      'ngFileUpload',
      'angularGrid',
      'validation.match',
      'root-controller',
      'login-controller',
      'register-controller',
      'category-controller',
      'store-controller',
      'offer-controller',
      'user-controller',
      'activity-controller',
      'transaction-controller',
      'jqdatepicker',
      'match-directive',
      'category-filter',
      'product-template',
      'product-type-template',
      'offer-button-template'
  	]);

    //app.constant('baseUrl', 'http://localhost:402/');
    //app.constant('baseUrl', 'http://localhost:51096/');
    app.constant('baseUrl', 'http://api.offerpal.in/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));
    //app.constant('webUrl', 'http://localhost:403/');
    app.constant('webUrl', 'http://www.offerpal.in/');
    
    app.config([
        'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            //cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="/images/logo.png" /> Loading...</div></div>';
        }
    ]);

    app.config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                console.log('default pre-close callback');
            }
        });
    }]);

    app.config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state("welcome", {
            	title: 'Offerpal - Your Cashback Buddy',
                url: "/",
                templateUrl: 'templates/home.html'
            }).state("login", {
                url: "/login",
                templateUrl: 'templates/login.html'
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
                templateUrl: 'templates/register.html'
            }).state("registered", {
                url: "/registered",
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
            }).state("admin.activities", {
                url: "/activities",
                templateUrl: 'templates/admin.activities.html',
            }).state("admin.transactions", {
                url: "/transactions",
                templateUrl: 'templates/admin.transactions.html',
            }).state("admin.invite", {
                url: "/invite",
                templateUrl: 'templates/admin.invite.html',
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
                url: "/redirect/store/:storeId/:token",
                templateUrl: 'templates/redirect.store.html',
                controller: function ($scope, baseUrl, $state) {
                	if (typeof $state.params.token === "undefined") {
                        $state.go('login');
                    }
                }
            }).state("redirectoffer", {
                url: "/redirect/offer/:offerId/:token",
                templateUrl: 'templates/redirect.offer.html',
                controller: function ($scope, baseUrl, $state) {
                	if (typeof $state.params.token === "undefined") {
                        $state.go('login');
                    }
                }
            }).state("account", {
                url: "/account",
                templateUrl: 'templates/account.html',
                controller: function ($scope, baseUrl, $state) {
                	$scope.page.setTitle("Account");
                	
                	if (!localStorage["offerpal_token"]) {
                        $state.go('login');
                    }
                }
            }).state("account.activities", {
                url: "/activities",
                templateUrl: 'templates/activities.html'
            }).state("account.wallet", {
                url: "/wallet",
                templateUrl: 'templates/wallet.html'
            }).state("account.redeem", {
                url: "/redeem",
                templateUrl: 'templates/redeem.html'
            }).state("account.changepassword", {
                url: "/changepassword",
                templateUrl: 'templates/changepassword.html'
            }).state("verify", {
                url: "/user/verify/?emailToken",
                templateUrl: 'templates/verify.html'
            }).state("reset", {
                url: "/user/reset/?emailToken",
                templateUrl: 'templates/reset.html'
            }).state("forgotpassword", {
                url: "/user/forgotpassword",
                templateUrl: 'templates/forgot-password.html'
            }).state("offersfeatured", {
                url: "/offers/featured",
                templateUrl: 'templates/offers-featured.html'
            }).state("offers", {
                url: "/offers",
                templateUrl: 'templates/offers.html'
            }).state("termsconditions", {
                url: "/terms-conditions",
                templateUrl: 'templates/terms-conditions.html'
            }).state("contact", {
                url: "/contact",
                templateUrl: 'templates/contact.html'
            }).state("search", {
                url: "/search/?keyword",
                templateUrl: 'templates/search.html'
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
})();