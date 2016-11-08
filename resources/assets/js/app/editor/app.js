define(['vendor/jquery', './editor'], function($1, editor) {

	function init() {
		editor.init($(".ken-editor")[0]);

		window.addEventListener("message", onWindowMessage);
	}

	function onWindowMessage(e) {
		if(e.source != window.parent) {
			return;
		}

		var action, args;
		try {
			var message = JSON.parse(e.data);
			action = message.action;
			args = message.args || {};
		} catch (ex) {
			return;
		}

		switch(action) {
			case "getCode":
				sendMessage(e.source, action, {
					code: editor.getCode()
				});
				break;
			case "setCode":
				editor.setCode(args.code);
				break;
			case "format":
				editor.format();
				break;
			case "redo":
				editor.redo();
				break;
			case "undo":
				editor.undo();
				break;
		}
	}

	function sendMessage(win, action, args) {
		var message = {
			action: action,
			args: args || {},
		};
		win.postMessage(JSON.stringify(message), "*");
	}

	return {
		init: init,
	}
});