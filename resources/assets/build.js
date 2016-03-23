{
	appDir: "./",
	dir: "../../public/assets",
	mainConfigFile: "./js/common.js",
	baseUrl: "./js/lib",
	fileExclusionRegExp: /(build|go)\.(js|txt)/,
	removeCombined: true,
	optimizeCss: 'standard',
	modules: [{
		name: "../common",
		include: ['jquery', 'jquery.cookie', 'jquery-ui', 'bootstrap', 'bootstrap-typeahead', "beautify", "ace/ace", "ace/ext-language_tools", "ace/theme-default", "ace/mode-arduino", "ace/snippets/text", "ace/snippets/arduino"]
	}, {
		name: "../index",
		include: ['../app/app-index'],
		exclude: ['../common']
	}],
}