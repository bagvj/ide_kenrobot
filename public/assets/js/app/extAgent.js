define(['jquery.cookie', './config', './util', './user', './project'], function(_, config, util, user, project) {
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
				showInstallDialog();
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
			} else if(action == "arduinoDriver") {
				showArduinoDriverDialog();
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

	function showInstallDialog() {
		util.confirm({
			title: "安装",
			cls: "extension-dialog",
			contentCls: "selectable",
			type: "info",
			text: '你没有安装啃萝卜<span class="strong">KenExt.crx</span>，请按以下步骤操作:<div class="step">Step 1: 点击<a href="http://platform.kenrobot.com/download/KenExt.crx" title="啃萝卜">下载</a><br />Step 2: 打开chrome浏览器，在地址栏输入<span class="strong">chrome://extensions</span><br />Step 3: 把<span class="strong">KenExt.crx</span>拖入浏览器<br />Step 4: 完成安装</div><div class="des">说明: 如果顶部弹出“无法添加来自此网站的应用...”，请点击确定。由于一些你懂的原因，我们不能把插件发布到google应用商店。就算能发布，部分用户也不能...，所以<span class="helpless">╮(╯▽╰)╭</span></div>',
		});
	}

	var isDialogShow;
	function showArduinoDriverDialog() {
		if(isDialogShow) {
			return;
		}
		
		var bit;
		if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
			bit = 64;
		} else {
			bit = 32;
		}
		var driverUrl = "http://platform.kenrobot.com/download/arduino-driver-x" + bit + ".zip";

		util.confirm({
			title: "驱动问题",
			cls: "arduino-driver-dialog",
			contentCls: "selectable",
			type: "info",
			text: '如果你遇到了Arduino<span class="strong">驱动问题</span>，请按以下步骤操作:<div class="step">Step 1: 点击<a href="' + driverUrl + '" title="Arduino驱动">下载</a>并解压<br />Step 2: 运行<span class="strong">arduino驱动安装.exe</span><br />Step 3: 完成安装</div>',
			cancelFunc: function() {
				isDialogShow = false;
			}
		});
		isDialogShow = true;
	}

	return {
		init: init,
	};
});