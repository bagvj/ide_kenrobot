define(['vendor/jquery', './editor'], function($1, editor) {

	function init() {
		editor.init($(".ken-editor")[0]);
	}

	return {
		init: init,
	}
});