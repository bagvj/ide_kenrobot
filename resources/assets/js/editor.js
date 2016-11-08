require.config({
	baseUrl: "/assets/js",
	shim: {
		"vendor/ace/mode-arduino": {
			deps: ['./ace'],
		},
		"vendor/ace/snippets/text": {
			deps: ['../ace'],
		},
		"vendor/ace/snippets/arduino": {
			deps: ['../ace', './text'],
		},
		"vendor/ace/theme-default": {
			deps: ['./ace'],
		},
		"vendor/ace/ext-language_tools": {
			deps: ['./ace', "./mode-arduino", "./snippets/text", "./snippets/arduino", "./theme-default"],
		},
	},
});

require(['./app/editor/app'], function(app) {
	app.init();
});