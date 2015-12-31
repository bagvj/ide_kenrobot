define(['extJS'], function() {
	function init(baseUrl, callback) {
		Ext.application({
			name: 'platform',
			appFolder: baseUrl + '/app',
			controllers: ["MainController"],
			autoCreateViewport: true,

			launch: function(){
				callback && callback();
			},
		});
	}
	
	return {
		init: init,
	}
});