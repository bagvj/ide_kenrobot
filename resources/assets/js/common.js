require.config({
	baseUrl: "assets/js/lib",
	paths: {
		app: "../app",
		ace: "./ace",
		"ace/ext-language_tools": "./ace/ext-language_tools",
	},

	shim: {
		"bootstrap": {
			deps: ['jquery'],
		},
		"bootstrap-typeahead": {
			deps: ['jquery'],
		},
		"jquery.cookie": {
			deps: ['jquery'],
		},
		"jquery-ui": {
			deps: ['jquery'],
		},
		"ace/ext-language_tools": {
			deps: ['./ace'],
		},
	},
});