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

		"app": "app",
		"util": "util",
		"EventManager": "EventManager",
		"nodeTemplate": "nodeTemplate",
		"hardware": "hardware",
		"software": "software",
		"code": "code",
		"user": "user",
		"project": "project",
		"sidebar": "sidebar",
		"board": "board",
		"component": "component",
		// "library"
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