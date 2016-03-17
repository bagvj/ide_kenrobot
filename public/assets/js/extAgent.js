define(['jquery-cookie', 'config', 'util', 'user', 'project'], function(_, config, util, user, project) {
	var timer;

	var messages;

	function init(launchUrl) {
		var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		if(!isChrome && !window.chrome) {
			util.message("Kenrobot平台扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");
			return;
		}

		checkIsIntalled(function(installed) {
			if(!installed) {
				var w = window.open("_blank");
				w.location = launchUrl;
				// window.open(launchUrl);
				return;
			}

			var callback = function() {
				launch(launchUrl);
			}
			if(config.extension.launchAuth) {
				user.authCheck(function(success) {
					success ? callback() : user.showLoginDialog(callback);
				});
			} else {
				callback();
			}			
		});
	}

	function launch(launchUrl) {
		clearInterval(timer);
		window.location = launchUrl;
		messages = [];
		timer = setInterval(tick, 1000);
	}

	function checkIsIntalled(callback) {
		chrome.runtime.sendMessage(config.extension.appId, "isInstalled", function(response) {
			if(response && response.action == "isInstalled" && response.result == true) {
				callback(true);
			} else {
				callback(false);
			}
		});
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