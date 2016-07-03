(function () {
    var app = angular.module('offer-controller', ['angular-loading-bar']);

    app.controller('OfferController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state', 'Upload', '$timeout', 
        function ($window, $scope, $http, $log, $scope, baseUrl, $state, Upload, $timeout) {
            $scope.offers = [];
            $scope.offer = {};
            $scope.categories = [];
            $scope.stores = [];
            $scope.offerTypes = [];
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
        	$scope.imageUpload = true;

            $scope.fetchCategories = function() {
                $http.get(baseUrl + "api/category/all").then(function (results) {
        		    $scope.categories = results.data;
		        });
            };

            $scope.fetchStores = function() {
                $http.get(baseUrl + "api/store/all").then(function (results) {
        		    $scope.stores = results.data;
		        });
            };

            $scope.fetchOfferTypes = function() {
                $http.get(baseUrl + "api/common/offertypes").then(function (results) {
        		    $scope.offerTypes = results.data;
		        });
            };

            $scope.fetchOffers = function() {
                $http.get(baseUrl + "api/offer/all").then(function (results) {
        		    $scope.offers = results.data;
		        });
            };

            $scope.fetchOffer = function(offerId) {
                $http.get(baseUrl + "api/offer?id=" + offerId).then(function (results) {
        		    $scope.offer = results.data;
        		    
        		    if ($scope.offer.Image !== '') {
        		    	$scope.Image = $scope.imageLoad($scope.offer.Image);
        		    	$scope.imageUpload = false;
        		    	
        		    	console.log($scope.Image);
        		    }
		        });
            };

            $scope.fetchOfferBySlug = function(offerSlug) {
                $http.get(baseUrl + "api/offer?slug=" + offerSlug).then(function (results) {
        		    $scope.offer = results.data;
        		    
        		    if ($scope.offer.Image !== '') {
        		    	$scope.Image = $scope.imageLoad($scope.offer.Image);
        		    	$scope.imageUpload = false;
        		    	
        		    	console.log($scope.Image);
        		    }
		        });
            };
            
            $scope.saveOffer = function(offer) {
        		var image = $scope.Image;
            	
        		if (typeof image !== "string") {
        			if (image !== null) offer.Image = image.name;
                	
        			$scope.upload(image);
        		}
        		
        		$http.post(baseUrl + "api/offer?token=" + $scope.token.Token, JSON.stringify(offer)).then(function (results) {
            		$scope.offer = results.data;
        		    
        		    if ($scope.offer.Image !== '') {
        		    	$scope.Image = $scope.imageLoad($scope.offer.Image);
        		    	$scope.imageUpload = false;
        		    }
        		    
        		    $state.go('admin.offer', {categoryId: $scope.offer.Id});

                    $scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };

            $scope.loadDefault = function() {
                $scope.fetchOffers();
                
                console.log($state.params.offerId);
                
                if ($state.params.offerId) {
                	$scope.fetchCategories();
                	$scope.fetchStores();
                	$scope.fetchOfferTypes();
                	
                	if ($state.params.offerId > 0) {
                		$scope.fetchOffer($state.params.offerId);
                	}
                }
            };
            
            $scope.loadFrontDefault = function() {
            	if ($state.params.offerSlug) {
            		$scope.fetchOfferBySlug($state.params.offerSlug);
                }
            	
            	if ($state.params.offerId) {
                	if ($state.params.offerId > 0) {
                		$scope.fetchOffer($state.params.offerId);
                	}
                }
            };
            
            $scope.$watch('offer.StartDateTime', function (newVal, oldVal) {
            	if (typeof $scope.offer.StartDateTime === "undefined") return;
            	
            	$scope.offer.StartDateTime = $scope.offer.StartDateTime.replace("T00:00:00", "");
            }, true);
            
            $scope.$watch('offer.EndDateTime', function (newVal, oldVal) {
            	if (typeof $scope.offer.EndDateTime === "undefined") return;
            	
            	$scope.offer.EndDateTime = $scope.offer.EndDateTime.replace("T00:00:00", "");
            }, true);
            
            $scope.upload = function(file) {
            	var resumable = false;
            	
            	file.upload = Upload.upload({
        			url: baseUrl + 'api/upload' + $scope.getReqParams(),
        			resumeSizeUrl: resumable ? baseUrl + 'api/upload?name=' + encodeURIComponent(file.name) : null,
					resumeChunkSize: resumable ? $scope.chunkSize : null,
					headers: {
						'optional-header': 'header-value'
					},
					data: {file: file}
        	    });

        	    file.upload.then(function (response) {
        	    	$timeout(function () {
        	    		file.result = response.data;
        	    	});
        	    }, function (response) {
        	    	if (response.status > 0)
        	    		$scope.errorMsg = response.status + ': ' + response.data;
        	    }, function (evt) {
        	    	// Math.min is to fix IE which reports 200% sometimes
        	    	file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        	    });

        	    file.upload.xhr(function (xhr) {
        	    	// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        	    });
            };
            
            $scope.getReqParams = function () {
        		return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode + '&errorMessage=' + $scope.serverErrorMsg : '';
        	};
            
        	$scope.removePicture = function() {
            	$scope.imageUpload = true;
            	$scope.Image = '';
            };
        }
    ]);
})();