(function () {
	var app = angular.module('product-template', []);
		
	app.directive('product', function() {
		return {
			restrict: 'E',
		    templateUrl: 'templates/single-product.html'
		};
	});
})();