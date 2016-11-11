require.config({
	baseUrl: "/assets/js",
	shim: {
		"vendor/bootstrap": {
			deps: ['./jquery'],
		},
		"vendor/bootstrap-typeahead": {
			deps: ['./jquery', './bootstrap'],
		},
		"vendor/jquery.cookie": {
			deps: ['./jquery'],
		},
		"vendor/jquery.scrollTo": {
			deps: ['./jquery'],
		},
		"vendor/jquery-ui": {
			deps: ['./jquery'],
		},
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
		"vendor/ace/theme-white": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-arduino": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-chrome": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-clouds": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-eclipse": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-github": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-monokai": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-terminal": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-textmate": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-tomorrow": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-xcode": {
			deps: ['./ace'],
		},
		"vendor/ace/ext-language_tools": {
			deps: ['./ace', "./mode-arduino", "./snippets/text", "./snippets/arduino", "./theme-default", "./theme-white", "./theme-arduino", "./theme-chrome", "./theme-clouds", "./theme-eclipse", "./theme-github", "./theme-monokai", "./theme-terminal", "./theme-textmate", "./theme-tomorrow", "./theme-xcode"],
		},
		"vendor/ace/ext-code_blast": {
			deps: ['./ace'],
		},
	},
});
require(['./app/index/app'], function(app) {
	app.init();
});
