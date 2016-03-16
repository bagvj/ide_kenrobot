var baseUrl = "/assets/js";
require.config({
	baseUrl: baseUrl,
	paths: {
		"jquery": "lib/jquery",
		"bootstrap": "lib/bootstrap",
		"typeahead": "lib/bootstrap-typeahead",
		"goJS": "lib/go",

		"jquery-ui": "lib/jquery-ui",
		"jquery-cookie": "lib/jquery.cookie",

		"ace": "lib/ace/ace",
		"ace-ext-language-tools": "lib/ace/ext-language_tools",


		"config": "config",
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
		"library": "library",
		"extAgent": "extAgent",
	},
	shim: {
		"bootstrap": {
			deps: ['jquery'],
		},
		"typeahead": {
			deps: ['jquery'],
		},
		"jquery-cookie": {
			deps: ['jquery'],
		},
		"jquery-ui": {
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