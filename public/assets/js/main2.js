require.config({
	baseUrl: "assets/js",
	paths: {
		'extJS': "lib/ext-all-debug",

		"app": "app",
	},
	shim: {
		'extJS': {
			exports: 'extJS'
		},
	}
});

require(['extJS', 'app'], function(_, app) {
	app.init();
});