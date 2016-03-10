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

		//Chrome app id
		chromeAppId: "ifpoaeabmakgihbkpodllibdgddjehgm",

		//Chrome app url
		chromeAppUrl: "http://platform.kenrobot.com/serial/debug"
	};
});