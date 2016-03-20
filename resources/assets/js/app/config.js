define(function() {
	return {
		//第一次访问时，是否显示引导
		showFirstVisitHint: true,

		//编译是否需要登录
		buildAuth: true,

		extension: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			//Chrome app启动时是否需要登录
			launchAuth: true,

			//Chrome app debug url
			debugUrl: "http://platform.kenrobot.com/extension/debug",

			//Chrome app burn url
			burnUrl: "http://platform.kenrobot.com/extension/burn",

			//烧写速度
			burnDelay: 250,
		}
	};
});