{
	appDir: "./",
	dir: "./pack",
	baseUrl: './js',
	fileExclusionRegExp: /build\.(js|txt)/,
	removeCombined: true,
	optimizeCss: 'standard',
	modules: [{
		name: "main",
		include: ['./app'],
	}],
}