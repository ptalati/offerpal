(function () {
    var app = angular.module('page-factory', ['angular-loading-bar']);

	app.factory('Page', function(){
		var title = 'default';
		var metaKeywords = 'default';
		var metaDescription = 'default';
		
		return {
			title: function() { return title; },
			metaKeywords: function() { return metaKeywords; },
			metaDescription: function() { return metaDescription; },
			setTitle: function(newTitle) { title = newTitle; },
			setMetaKeywords: function(newMetaKeywords) { metaKeywords = newMetaKeywords; },
			setMetaDescription: function(newMetaDescription) { metaDescription = newMetaDescription; }
		};
	});
})();