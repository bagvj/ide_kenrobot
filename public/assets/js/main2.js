var baseUrl = "/assets/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "lib/jquery.min",
		"bootstrap": "lib/bootstrap",
		"ace": "lib/ace/ace",
		"ace-ext-language-tools": "lib/ace/ext-language_tools",
		"app": "app2",
		"util": "util2",

	},
	shim: {
		"bootstrap": {
			deps: ['jquery'],
		},
		"ace-ext-language-tools": {
			deps: ['ace'],
		},
	},
});

require(['app'], function(app) {
	app.init();
});