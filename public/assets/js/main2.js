var baseUrl = "/assets/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "lib/jquery.min",
		"bootstrap": "lib/bootstrap",
		"typeahead": "lib/bootstrap-typeahead.min",

		"ace": "lib/ace/ace",
		"ace-ext-language-tools": "lib/ace/ext-language_tools",

		"goJS": "lib/go",

		"app": "app2",
		"util": "util2",
		"EventManager": "EventManager",
		"hardwareConfigs": "hardwareConfigs",
		"nodeTemplate": "nodeTemplate2",
		"hardware": "hardware2",
		"code": "code2",
	},
	shim: {
		"bootstrap": {
			deps: ['jquery'],
		},
		"typeahead": {
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