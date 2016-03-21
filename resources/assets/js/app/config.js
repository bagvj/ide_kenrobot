define(function() {
	return {
		//第一次访问时，是否显示引导
		// needPV: true,

		//编译是否需要登录
		buildAuth: true,

		//引导配置
		guide: {
			showIfFirstVisit: true,
			autoNextDelay: 3000,
		},

		//chrome扩展app配置
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
		},
	};
});