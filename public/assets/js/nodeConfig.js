define(['jquery'], function($) {
	function getItems() {
		var items;
		$.ajax({
			url: './items',
			dataType: 'json',
			async: false,
			success: function(result) {
				items = result;
			}
		});
		return items;
	}
	
	return getItems();
});
