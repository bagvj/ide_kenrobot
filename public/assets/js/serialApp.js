define(['jquery-cookie', 'config', 'user', 'project'], function(_, config, user, project) {
	var timer;

	var messages;

	function init(launchUrl) {
		clearInterval(timer);

		window.location = launchUrl;

		messages = [];
		timer = setInterval(tick, 1000);
	}

	function tick() {
		var message = messages.length > 0 ? messages.shift() : "nothing";
		sendMessage(message);
	}

	function sendMessage(message) {
		chrome.runtime.sendMessage(config.extension.appId, message, onResponse);
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
				doInit(request);
			} else if(action == "build") {
				doBuild(request);
			} else if(action == "setCookie") {
				doSetCookie(request);
			}
		}
	}

	function doInit(request) {
		var cookie;
		try {
			cookie = JSON.parse($.cookie('serial-' + request.id));
		} catch(ex) {
			cookie = {};
		}
		messages.push({
			action: request.action,
			result: {
				host: window.location.protocol + "//" + window.location.host,
				cookie: cookie,
				config: {
					arduinoDriverUrl: config.extension.arduinoDriverUrl,
					burnDelay: config.extension.burnDelay,
				}
			},
		});
	}

	function doBuild(request) {
		project.build(function(result) {
			messages.push({
				action: request.action,
				result: result,
			});
		});
	}

	function doSetCookie(request) {
		$.cookie('serial-' + request.id, JSON.stringify(request.cookie));
		messages.push({
			action: request.action,
			result: true,
		});
	}

	return {
		init: init,
	};
});