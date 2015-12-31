var baseUrl = "/assets/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		'extJS': "lib/ext-all-debug",
		"app": "app",
	},
});

require(['app'], function(app) {
	app.init(baseUrl);
});