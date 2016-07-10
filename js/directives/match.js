(function () {
	var app = angular.module('match-directive', []);
	
	app.directive('match',['$parse', function ($parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attrs, ctrl) {
				scope.$watch(function() {
					return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || $parse(attrs.match)(scope) === ctrl.$modelValue;
				}, function(currentValue) {
					ctrl.$setValidity('match', currentValue);
				});
	
				ctrl.$parsers.unshift(function(viewValue) {
					var pwdValidLength, pwdHasLetter, pwdHasNumber;
					
					pwdValidLength = (viewValue && viewValue.length >= 8 ? true : false);
					pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? true : false;
					pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? true : false;
					
					if( pwdValidLength && pwdHasLetter && pwdHasNumber ) {
						ctrl.$setValidity('pwd', true);
					} else {
						ctrl.$setValidity('pwd', false);                    
					}
					return viewValue;
				});
			},
		};
	}]);
})();