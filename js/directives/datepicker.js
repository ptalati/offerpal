(function () {
	var app = angular.module('jqdatepicker', []);
	
	app.directive('jqdatepicker', function () {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        scope: true,
	        link: function (scope, element, attrs, ngModelCtrl) {
	            element.datepicker({
	                dateFormat: 'yy-mm-dd',
	                onSelect: function (date) {
	                	scope.$eval(attrs.ngModel + "='" + date + "'");
	                    scope.$apply();
	                }
	            });
	        }
	    };
	});
})();