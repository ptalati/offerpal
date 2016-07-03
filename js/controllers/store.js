(function () {
    var app = angular.module('store-controller', ['angular-loading-bar']);

    app.controller('StoreController', [
        '$window', '$scope', '$http', '$log', '$scope', 'baseUrl', '$state', 'Upload', '$timeout',
        function ($window, $scope, $http, $log, $scope, baseUrl, $state, Upload, $timeout) {
            $scope.stores = [];
            $scope.store = {};
            $scope.storeTypes = [];
            $scope.offers = [];
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
        	$scope.imageUpload = true;

            $scope.fetchOffers = function(categoryId, storeId) {
            	categoryId = categoryId || 0;
            	storeId = storeId || 0;
            	
                $http.get(baseUrl + "api/offer?categoryId=" + categoryId + "&storeId=" + storeId).then(function (results) {
        		    $scope.offers = results.data;
		        });
            };

            $scope.fetchStoreTypes = function() {
                $http.get(baseUrl + "api/common/storetypes").then(function (results) {
        		    $scope.storeTypes = results.data;
		        });
            };

            $scope.fetchStores = function() {
                $http.get(baseUrl + "api/store/all").then(function (results) {
        		    $scope.stores = results.data;
		        });
            };

            $scope.fetchStore = function(storeId) {
                $http.get(baseUrl + "api/store?id=" + storeId).then(function (results) {
        		    $scope.store = results.data;
        		    
        		    if ($scope.store.Logo !== '') {
        		    	$scope.Image = $scope.imageLoad($scope.store.Logo);
        		    	$scope.imageUpload = false;
        		    }
		        });
            };

            $scope.fetchStoreBySlug = function(storeSlug) {
                $http.get(baseUrl + "api/store?slug=" + storeSlug).then(function (results) {
        		    $scope.store = results.data;
        		    
        		    $scope.fetchOffers(0, $scope.store.Id);
        		    $scope.page.setTitle($scope.store.Name);
		        });
            };
            
            $scope.saveStore = function(store) {
            	var image = $scope.Image;
            	
        		if (typeof image !== "string") {
        			if (image !== null) store.Logo = image.name;
                	
        			$scope.upload(image);
        		}
        		
            	$http.post(baseUrl + "api/store?token=" + $scope.token.Token, JSON.stringify(store)).then(function (results) {
        		    $scope.store = results.data;
        		    
        		    if ($scope.store.Logo !== '') {
        		    	$scope.Image = $scope.imageLoad($scope.store.Logo);
        		    	$scope.imageUpload = false;
        		    }
        		    
        		    $state.go('admin.store', {storeId: $scope.store.Id});

                    $scope.success = {
                        Status: true,
                        Message: 'Record has been saved.'
                    };
		        });
            };

            $scope.loadDefault = function () {
            	$scope.fetchStores();
                
                console.log($state.params.storeId);
                
                if ($state.params.storeId) {
                	$scope.fetchStoreTypes();
                	
                	if ($state.params.storeId > 0) {
                		$scope.fetchStore($state.params.storeId);
                	}
                }
            };
            
            $scope.loadFrontDefault = function() {
                if ($state.params.storeSlug) {
                	$scope.fetchStoreBySlug($state.params.storeSlug);
                }
                
                if ($state.params.storeId) {
                	if ($state.params.storeId > 0) {
                		$scope.fetchStore($state.params.storeId);
                	}
                }
            };
            
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