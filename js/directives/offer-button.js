(function () {
	var app = angular.module('offer-button-template', []);
		
	app.directive('offerButton', function() {
		return {
			restrict: 'E',
		    templateUrl: 'templates/offer-button.html'
		};
	});
})();