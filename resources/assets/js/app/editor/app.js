define(['vendor/jquery', './editor'], function($1, editor) {

	function init() {
		editor.init($(".ken-editor")[0]);

		window.addEventListener("message", onWindowMessage);
	}

	function onWindowMessage(e) {
		if(e.source != window.parent) {
			return;
		}

		console.log(e.data);
		var data = e.data.split('::');
		var message = data[0];
		var args = JSON.parse(data[1] || "{}");
		switch(message) {
			case "getCode":
				sendMessage(e.source, message, {
					code: editor.getCode()
				});
				break;
			case "setCode":
				editor.setCode(args.code);
				break;
		}
	}

	function sendMessage(win, message, args) {
		win.postMessage(message + "::" + JSON.stringify(args || {}), "*");
	}

	return {
		init: init,
	}
});