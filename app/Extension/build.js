{
	appDir: "./",
	dir: "./pack",
	mainConfigFile: "./js/common.js",
	fileExclusionRegExp: /build\.(js|txt)/,
	removeCombined: true,
	optimizeCss: 'standard',
	modules: [{
		name: "../common",
		include: ['jquery']
	}, {
		name: "../burn",
		include: ['app/app-burn'],
		exclude: ['../common']
	}, {
		name: "../debug",
		include: ['app/app-debug'],
		exclude: ['../common']
	}],
}