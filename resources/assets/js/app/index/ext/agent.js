define(['vendor/jquery', '../util'], function(_, util) {
	var config;
	var API;

	function init(_config) {
		config = _config;
		API = getChromeAPI();
	}

	function getConfig() {
		return config;
	}

	function check() {
		var promise = $.Deferred();
		if(!isChrome() || !API) {
			util.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");
			return promise;
		}

		checkExt().done(function() {
			promise.resolve();
		}).fail(showInstallDialog);

		return promise;
	}

	function sendMessage(message, callback) {
		message = typeof message == "string" ? {action: message} : message;
		callback = callback || function() {};
		API.runtime.sendMessage(config.appId, message, callback);
	}

	function isChrome() {
		return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	}

	function getChromeAPI() {
		if(!isChrome()) {
			return null;
		}

		return window.chrome;
	}

	function checkExt() {
		var promise = $.Deferred();
		API.runtime.sendMessage(config.appId, "ping", function(response) {
			if(response && response.action == "ping" && response.result == "pong") {
				promise.resolve();
			} else {
				promise.reject();
			}
		});
		return promise;
	}

	function showInstallDialog() {
		util.dialog(".install-dialog");
	}

	return {
		init: init,
		check: check,
		sendMessage: sendMessage,
		getConfig: getConfig,
	}
});