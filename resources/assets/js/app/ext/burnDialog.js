define(['vendor/jquery', '../util', '../EventManager', './agent', '../project', '../serial', '../config'], function(_, util, EventManager, agent, project, serial, config) {
	var hasInit;
	var selector;
	var host;
	
	var connectionId;
	var hexUrl;

	function init() {
		EventManager.bind("burn", "show", onShow);
	}

	function onShow() {
		doInit();
		
		project.build(true).done(function(hexUrl) {
			agent.check().done(function() {
				show(hexUrl);
			});
		});
	}

	function doInit() {
		if(hasInit) {
			return;
		}

		hasInit = true;
		host = window.location.protocol + "//" + window.location.host;

		selector = $(".burn-dialog");
		$('.driver', selector).on('click', onDriverClick);
		$('.tab-burn .burn', selector).on('click', onBurnClick);
	}

	function show(_hexUrl) {
		hexUrl = _hexUrl;
		util.dialog({
			selector: selector,
			onClosing: onDialogClosing,
			onClose: onDialogClose,
		});

		serial.refreshPort().then(function() {
			onConnectClick();
		}, function(result) {
			switchTab("error");
			var message = $('.tab-error .message-' + result.status);
			util.toggleActive(message);
		});
	}

	function onDialogClosing() {
		
	}

	function onDialogClose() {
		$('.tab', selector).removeClass("active").eq(0).addClass("active");
		$('.tab-burn .burn-progress', selector).removeClass("active");

		agent.sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
		connectionId = null;
		hexUrl = null;
		watchProgress(false);
	}

	function onDriverClick(e) {
		$('.x-dialog-close', selector).click();
		setTimeout(function() {
			EventManager.trigger('driverDialog', 'show');
		}, 400);
	}

	function doConnect() {
		var promise = $.Deferred();

		var bitRate = serial.getBaudRate();
		var portPath = serial.getPort();

		agent.sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(connId) {			
			connId ? promise.resolve(connId) : promise.reject();
		});

		return promise;
	}

	function onConnectClick(e) {
		doConnect().then(function(connId) {
			connectionId = connId;
			switchTab("burn");
		}, function(result) {
			util.message("连接失败");
		});
	}

	function onBurnClick(e) {
		$('.tab-burn .burn', selector).addClass("burning").attr("disabled", true);
		$('.tab-burn .burn-progress', selector).addClass("active");
		updateProgress(0);
		showMessage("正在烧写", "burn", 0);

		agent.sendMessage({
			action: "upload",
			url: host + hexUrl + "/hex",
			delay: config.serial.uploadDelay,
		}, function(result) {
			watchProgress(false);
			$('.tab-burn .burn', selector).removeClass("burning").attr("disabled", false);
			$('.tab-burn .burn-progress', selector).removeClass("active");
			$('.tab-burn .burn-progress ul li.ins', selector).removeClass("ins");
			showMessage("烧写" + (result ? "成功" : "失败"), "burn", 0);
		});
		watchProgress(true);
	}

	var watchTimer;
	function watchProgress(value) {
		clearInterval(watchTimer);

		var delay = config.serial.uploadDelay;
		if(value) {
			var queryProgress = function() {
				agent.sendMessage("upload.progress", updateProgress);
			};
			watchTimer = setInterval(queryProgress, delay);
		}
	}

	function switchTab(tab) {
		util.toggleActive($('.tab-' + tab, selector));
		if(tab == "burn") {
			$('.tab-burn .burn', selector).removeClass("burning").attr("disabled", false);
			$('.tab-burn .burn-progress', selector).removeClass("active");
			$('.tab-burn .burn-progress ul li.ins', selector).removeClass("ins");
			showMessage("准备就绪", "burn", 0);
		}
	}

	function showMessage(text, tab, delay) {
		var message = $(".tab-" + tab + " .message", selector).text(text).stop().show();
		if(delay != 0) {
			delay = delay || 2000
			message.delay(delay).queue(function() {
				message.hide();
				message.dequeue();
			});
		}
	}

	function updateProgress(progress) {
		var list = $('.tab-burn .burn-progress ul li', selector);
		var lastIndex = list.filter("ins").last().index();
		var index = Math.floor(progress / 100 * list.length);
		for(var i = lastIndex + 1; i <= index; i++) {
			list.eq(i).addClass("ins");
		}
	}

	return {
		init: init,
	};
});