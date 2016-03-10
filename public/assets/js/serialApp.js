define(['config', 'user'], function(config, user) {
	var timer;

	var messages;

	function init() {
		clearInterval(timer);

		window.location = config.chromeAppUrl;

		messages = [];
		timer = setInterval(tick, 1000);

		sendMessage({
			action: "init",
			result: {
				host: window.location.host,
			},
		})
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
			if(action == "authCheck") {
				authCheck(request.callbacks);
			} else if(action == "build") {

			}
		}
	}

	function tick() {
		var message = messages.length > 0 ? messages.shift() : "nothing";
		sendMessage(message);
	}

	function authCheck(callback) {
		user.authCheck(function(success) {
			if(success) {
				messages.push({
					action: "authCheck",
					result: true,
					callbacks: callbacks,
				});
			} else {
				messages.push({
					action: "authCheck",
					result: false,
				});
			}
		});
	}

	return {
		init: init,
		sendMessage: sendMessage,
	};
});