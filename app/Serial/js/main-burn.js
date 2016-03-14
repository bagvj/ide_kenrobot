var baseUrl = "/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "jquery.min",
		"app": "app-burn",
		"upload": "upload",
	},
});

require(['app'], function(app) {
	app.init();
});