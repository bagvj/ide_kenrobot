require.config({
	// combine : true, //开启动态合并
	packages: [{
		name: "platform",
		path: "/assets/js",
	}, ],
	modules: {
		"platform/app": {
			alias: ["platform/app3"],
		},
		"platform/util": {
			alias: ["platform/util3"],
		},
	}
});

require(['platform/app'], function(app) {
	app.init();
});