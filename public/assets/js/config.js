define(function() {
	return {
		// 离开页面时，是否显示unload对话框
		showUnloadDialog: true,

		//第一次访问时，是否显示引导
		showFirstVisitHint: true,

		//编译是否需要登录
		buildAuth: true,

		serial: {
			//Chrome app id
			appId: "mfbnaojpghblnkmjipacgpjjhjddeiph",

			//Chrome app启动时是否需要登录
			launchAuth: true,

			//Chrome app debug url
			debugUrl: "http://platform.kenrobot.com/serial/debug",

			//Chrome app burn url
			burnUrl: "http://platform.kenrobot.com/serial/burn",

			arduinoDriverUrl: "http://platform.kenrobot.com/arduino/driver",

			//烧写速度
			burnDelay: 250,
		}
	};
});