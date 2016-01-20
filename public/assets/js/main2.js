var baseUrl = "/assets/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "lib/jquery.min",
		"bootstrap": "lib/bootstrap",
		"ace": "lib/ace/ace",
		"app": "app2",
		"util": "util2",
	},
	shim: {
		"bootstrap": {
			deps: ['jquery'],
		}
	}
});

require(['app'], function(app) {
	app.init();
});