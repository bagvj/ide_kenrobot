var baseUrl = "/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "jquery.min",
		"app": "app",
		"upload": "upload",
	},
});

require(['app'], function(app) {
	app.init();
});