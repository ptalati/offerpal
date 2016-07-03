(function () {
	var app = angular.module('product-type-template', []);
		
	app.directive('productType', function() {
		return {
			restrict: 'E',
		    templateUrl: 'templates/product-type.html'
		};
	});
})();