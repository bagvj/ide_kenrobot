define(['jquery', './upload'], function($, upload) {
	var appWindow;
	var windowId = "burn";
	
	var connectionId;
	var messages = [];

	var isInit;
	var host;
	var cookies = {};
	var config;

	function init() {
		appWindow = chrome.app.window.current();
		appWindow.onClosed.addListener(onAppClosed);
		
		initTabNoSerial();
		initTabConnect();
		initTabBurn();

		chrome.runtime.onMessageExternal.addListener(onMessageExternal);

		sendMessage({
			action: "init",
		});
	}

	function onAppClosed() {
		disconnect();
	}

	function checkSerial() {
		chrome.serial.getDevices(function(ports) {
			if(ports.length == 0) {
				//没有串口连接
				switchTab("no-serial");
				setTimeout(checkSerial, 1);
				return;
			}

			var portList = $('.tab-connect .port').empty();
			var count = 0;
			for(var i = 0; i < ports.length; i++) {
				var port = ports[i];
				$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
				if(port.displayName && port.displayName.toLowerCase().indexOf("arduino") > -1) {
					count++;
				}
			}

			//有且仅有一个arduino设置连接
			if(count == 1) {
				$('.tab-connect .connect').click();
			} else {
				switchTab("connect");
			}
		});
	}

	function switchTab(tab) {
		toggleActive($('.tab-' + tab));
		if(tab == "connect") {

		} else if(tab == "burn") {
			showMessage("准备就绪", "burn", 0);
			$('.tab-burn .progress').removeClass("active");
		}
	}

	function initTabNoSerial() {
		$('.tab-no-serial .driver').on('click', onDriverClick);
	}

	function onDriverClick(e) {
		sendMessage({
			action: "arduinoDriver",
		});
	}

	function initTabConnect() {
		var bitRates = [115200, 57600, 19200, 9600, 4800];
		var rateList = $('.tab-connect .bitRate').empty();
		for(var i = 0; i < bitRates.length; i++) {
			var rate = bitRates[i];
			$('<option>').text(rate).appendTo(rateList);
		}

		$('.tab-connect .connect').on('click', onConnectClick);
	}

	function onConnectClick(e) {
		var portPath = $('.tab-connect .port').val();
		var bitRate = parseInt($('.tab-connect .bitRate').val());

		try {
			chrome.serial.connect(portPath, {
				'bitrate': bitRate,
			}, function(connectionInfo) {
				if(connectionInfo && connectionInfo.connectionId) {
					connectionId = connectionInfo.connectionId;

					setCookie("bitRate", bitRate);
					setCookie("portPath", portPath);

					switchTab("burn");
				} else {
					switchTab("connect");
					showMessage("连接失败", "connect");
				}
			});
		} catch(ex) {
			switchTab("connect");
			showMessage("连接失败", "connect");
			console.dir(ex);
		}
	}

	function showMessage(text, tab, delay) {
		var message = $(".tab-" + tab + " .message").text(text).stop().show();
		if(delay != 0) {
			delay = delay || 2000
			message.delay(delay).queue(function() {
				message.hide();
				message.dequeue();
			});
		}
	}

	function initTabBurn() {
		$('.tab-burn .burn').on('click', onBurnClick);
		var ul = $('.tab-burn .progress ul');
		for(var i = 0; i < 50; i++) {
			ul.append('<li></li>');
		}
	}

	function onBurnClick(e) {
		if(!isInit) {
			return;
		}

		$('.tab-burn .burn').addClass("burning").attr("disabled", true);
		showMessage("正在编译", "burn", 0);

		$('.tab-burn .progress ul li.ins').removeClass("ins");
		$('.tab-burn .progress').addClass("active");
		updateProgress(0);

		sendMessage({
			action: "build",
		});
	}

	function disconnect(back) {
		if(connectionId) {
			try {
				chrome.serial.disconnect(connectionId, function(result) {

				});
			} catch(ex) {
				console.log(ex);
			}
			connectionId = null;
		}

		if(back) {
			switchTab("connect");
		}
	}

	function toggleActive(target, collapseMode) {
		var tag = target[0].tagName || "li";
		if(collapseMode) {
			if(target.hasClass("active")) {
				target.removeClass("active");
				return false;
			} else {
				target.parent().find(">" + tag + ".active").removeClass("active");
				target.addClass("active");
				return true;
			}
		} else {
			if (target.hasClass("active")) {
				return false;
			}

			target.parent().find(">" + tag + ".active").removeClass("active");
			target.addClass("active");

			return true;
		}
	}

	function getCookie(key) {
		return cookies[key];
	}

	function setCookie(key, value) {
		cookies[key] = value;
		sendMessage({
			action: "setCookie",
			cookie: cookies,
		});
	}

	function sendMessage(message) {
		message.id = windowId;
		messages.push(message);
	}

	function onMessageExternal(message, sender, sendResponse) {
		if(message == "nothing") {
			if(messages.length > 0) {
				sendResponse(messages);
				messages = [];
			}
		} else {
			var action = message.action;
			var result = message.result;
			if(action == "init") {
				doInit(result);
			} else if(action == "build") {
				doUpload(result);
			}
		}
	}

	function doInit(result) {
		host = result.host;
		cookies = result.cookie || {};
		config = result.config;

		isInit = true;

		checkSerial();
	}

	function doUpload(result) {
		if(result.status == 0) {
			$.ajax({
				url: host + result.url + "/hex",
			}).done(function(hexData) {
				updateProgress(5);
				showMessage("正在烧写", "burn", 0);
				upload.exec(connectionId, hexData, config.burnDelay, function(success) {
					$('.tab-burn .burn').removeClass("burning").attr("disabled", false);
					showMessage("烧写" + (success ? "成功" : "失败"), "burn", 0);
				}, updateProgress);
			});
		} else {
			showMessage(result.message, "burn");
		}
	}

	function updateProgress(progress) {
		var list = $('.tab-burn .progress ul li');
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