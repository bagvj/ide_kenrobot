define(['vendor/jquery', '../util', './agent'], function(_, util, agent) {
	var isInit;

	var selector;
	var host;
	
	var connectionId;
	var hexUrl;

	function init() {
		if(isInit) {
			return;
		}
		isInit = true;

		host = window.location.protocol + "//" + window.location.host;

		selector = ".burn-dialog";

		var bit;
		if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
			bit = 64;
		} else {
			bit = 32;
		}
		var downloadUrl = "/download/arduino-driver-x" + bit + ".zip";
		$('.arduino-driver-dialog .downloadUrl').attr('href', downloadUrl);

		$('.driver', selector).on('click', onDriverClick);
		$('.tab-connect .connect', selector).on('click', onConnectClick);
		$('.tab-burn .burn', selector).on('click', onBurnClick);
	}

	function show(_hexUrl) {
		init();

		hexUrl = _hexUrl;
		util.dialog({
			selector: selector,
			onClosing: onDialogClosing,
			onClose: onDialogClose,
		});

		checkSerialPorts();
	}

	function onDialogClosing() {
		
	}

	function onDialogClose() {
		$('.tab', selector).removeClass("active").eq(0).addClass("active");
		$('.tab-burn .burn-progress', selector).removeClass("active");
		$('.tab-connect .port', selector).empty();

		agent.sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
		connectionId = null;
		hexUrl = null;
		watchProgress(false);
	}

	function checkSerialPorts() {
		agent.sendMessage("serial.getDevices", function(ports) {
			if(!ports || ports.length == 0) {
				//没有串口连接
				switchTab("no-serial");
				setTimeout(checkSerialPorts, 1);
				return;
			}

			var portList = $('.tab-connect .port', selector).empty();
			var count = 0;
			var nameReg = agent.getConfig().nameReg;
			for(var i = 0; i < ports.length; i++) {
				var port = ports[i];
				$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
				if(nameReg.test(port.path) || (port.displayName && nameReg.test(port.displayName))) {
					count++;
				}
			}

			if(count == 1) {
				//有且仅有一个arduino设置连接
				$('.tab-connect .connect', selector).click();
			} else {
				switchTab("connect");
			}
		});
	}

	function onDriverClick(e) {
		$('.x-dialog-close', selector).click();
		setTimeout(function() {
			util.dialog('.arduino-driver-dialog');
		}, 400);
	}

	function onConnectClick(e) {
		var portPath = $('.tab-connect .port', selector).val();
		var bitRate = parseInt($('.tab-connect .bitRate', selector).val());

		agent.sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(_connectionId) {
			if(_connectionId) {
				connectionId = _connectionId;

				switchTab("burn");
			} else {
				switchTab("connect");
				showMessage("连接失败", "connect");
			}
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
			delay: agent.getConfig().uploadDelay,
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

		var delay = agent.getConfig().uploadDelay;
		if(value) {
			var queryProgress = function() {
				agent.sendMessage("upload.progress", updateProgress);
			};
			watchTimer = setInterval(queryProgress, delay);
		}
	}

	function switchTab(tab) {
		util.toggleActive($('.tab-' + tab, selector));
		if(tab == "connect") {

		} else if(tab == "burn") {
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
		show: show,
	};
});