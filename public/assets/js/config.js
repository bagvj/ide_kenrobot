define(function() {
	return {
		// 离开页面时，是否显示unload对话框
		showUnloadDialog: true,

		//第一次访问时，是否显示引导
		showFirstVisitHint: true,

		//编译是否需要登录
		buildAuth: true,

		//烧写是否需要登录
		uploadAuth: true,


		serial: {
			//Chrome app id
			appId: "kllcakemjghaolghdkhofbehahlnhdjp",

			//Chrome app debug url
			debugAppUrl: "http://platform.kenrobot.com/serial/debug",

			//Chrome app burn url
			burnAppUrl: "http://platform.kenrobot.com/serial/burn",

			arduinoDriverUrl: "http://platform.kenrobot.com/arduino/driver",

			//烧写速度
			burnDelay: 150,
		}
	};
});