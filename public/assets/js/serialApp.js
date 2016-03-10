define(['config', 'user', 'project'], function(config, user, project) {
	var timer;

	var messages;

	function init() {
		clearInterval(timer);

		window.location = config.chromeAppUrl;

		messages = [];
		timer = setInterval(tick, 1000);
	}

	function sendMessage(message) {
		chrome.runtime.sendMessage(config.chromeAppId, message, onResponse);
	}

	function onResponse(response) {
		if(!response || response == "nothing") {
			return;
		}

		var requests = $.isArray(response) ? response : [response];
		for(var i = 0; i < requests.length; i++) {
			var request = requests[i];
			var action = request.action;
			if(action == "init") {
				doInit();
			} else if(action == "build") {
				doBuild();
			}
		}
	}

	function doInit() {
		messages.push({
			action: "init",
			result: {
				host: window.location.protocol + "//" + window.location.host,
			},
		});
	}

	function doBuild() {
		project.build(function(result) {
			messages.push({
				action: "build",
				result: result,
			});
		});
	}

	function tick() {
		var message = messages.length > 0 ? messages.shift() : "nothing";
		sendMessage(message);
	}

	return {
		init: init,
		sendMessage: sendMessage,
	};
});