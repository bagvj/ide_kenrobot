define(['../util', '../user', './burn-dialog'], function(util, user, burnDialog) {
	var config;

	function init(_config) {
		config = _config;
	}

	function check(callback) {
		var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		if(!isChrome && !window.chrome) {
			util.message("Kenrobot平台扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");
			return;
		}

		checkExt(function(installed) {
			if(!installed) {
				showInstallDialog();
				return;
			}

			if(config.launchAuth) {
				user.authCheck(function(success) {
					success ? callback() : user.showLoginDialog(callback);
				});
			} else {
				callback();
			}			
		});
	}

	function checkExt(callback) {
		chrome.runtime.sendMessage(config.appId, "ping", function(response) {
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
			burnDialog.init(config);
			burnDialog.show(hexUrl);
		});
	}

	return {
		init: init,
		showBurnDialog: showBurnDialog,
	}
});