define(['../util', './burn-dialog'], function(util, burnDialog) {
	var config;
	var API;

	function init(_config) {
		config = _config;
		API = getChromeAPI();
	}

	function check(callback) {
		if(!isChrome() || !API) {
			util.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");
			return;
		}

		checkExt(function(installed) {
			installed ? callback() : showInstallDialog();
		});
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

	function checkExt(callback) {
		API.runtime.sendMessage(config.appId, "ping", function(response) {
			if(response && response.action == "ping" && response.result == "pong") {
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	function showInstallDialog() {
		util.dialog(".install-dialog");
	}

	function showBurnDialog(hexUrl) {
		check(function() {
			burnDialog.init(API, config);
			burnDialog.show(hexUrl);
		});
	}

	return {
		init: init,
		showBurnDialog: showBurnDialog,
	}
});