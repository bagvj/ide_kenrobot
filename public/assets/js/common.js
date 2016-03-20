require.config({
	baseUrl: "/assets/js/lib",
	shim: {
		"bootstrap": {
			deps: ['./jquery'],
		},
		"bootstrap-typeahead": {
			deps: ['./jquery', './bootstrap'],
		},
		"jquery.cookie": {
			deps: ['./jquery'],
		},
		"jquery-ui": {
			deps: ['./jquery'],
		},
		"ace/ext-language_tools": {
			deps: ['./ace'],
		},
	},
});