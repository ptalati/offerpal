(function () {
    var app = angular.module('category-filter', ['angular-loading-bar']);

    app.filter('categoryFilter', function () {
		return function (items, parentId) {
			var filtered = [];
			
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				
				if (item.Parent.Id === parentId) {
					filtered.push(item);
				}
	    	}
	    
	    	return filtered;
		};
	});
})();