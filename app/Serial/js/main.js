var baseUrl = "/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "jquery.min",
		"app": "app",
	},
});

require(['app'], function(app) {
	app.init();
});