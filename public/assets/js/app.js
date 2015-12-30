define(['extJS'], function() {
	function init(callback) {
		Ext.application({
			name: 'platform',
			appFolder: 'assets/js/app',
			controllers: ["MainController"],
			autoCreateViewport: true,

			launch: function(){
				callback && callback();
			}
		});
	}
	
	return {
		init: init,
	}
});