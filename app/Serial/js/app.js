define(['jquery', 'upload'], function($, upload) {
	var appWindow;
	var windowId = "kenrobot";
	
	var connectionId;
	var hexFileData;
	var messages;
	var host;

	function init() {
		appWindow = chrome.app.window.get(windowId);
		appWindow.onClosed.addListener(onAppClosed);
		
		initTabConnect();
		initTabDebug();
		initTabBurn();

		messages = [];
		chrome.runtime.onMessageExternal.addListener(onMessageExternal);
	}

	function onAppClosed() {
		disconnect();
	}

	function switchTab(tab) {
		toggleActive($('.tab-' + tab));
		if(tab == "connect") {

		} else if(tab == "debug") {
			$('.tab-debug .input').val('').focus();
			$('.tab-debug .output').val('');
		} else if(tab == "burn") {

		}
	}

	function initTabConnect() {
		chrome.serial.getDevices(function(ports) {
			var portList = $('.tab-connect .port').empty();
			for(var i = 0; i < ports.length; i++) {
				var port = ports[i];
				$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
			}
		});

		var bitRates = [115200, 57600, 19200, 9600, 4800];
		var rateList = $('.tab-connect .bitRate').empty();
		for(var i = 0; i < bitRates.length; i++) {
			var rate = bitRates[i];
			$('<option>').text(rate).appendTo(rateList);
		}
		rateList.val(115200);

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
					// switchTab("debug");
					switchTab("burn");
				} else {
					showMessage("连接失败", "connect");
				}
			});
		} catch(ex) {
			showMessage("连接失败", "connect");
			console.dir(ex);
		}
	}

	function showMessage(text, tab) {
		var message = $(".tab-" + tab + " .message").text(text).stop().show();
		message.delay(2000).queue(function() {
			message.hide();
			message.dequeue();
		});
	}

	function initTabDebug() {
		$('.tab-debug .send').on('click', onSendClick);
		$('.tab-debug .input').on('keyup', onInputKeyup);

		chrome.serial.onReceive.addListener(onReceive);
		chrome.serial.onReceiveError.addListener(onReceiveError);
	}

	function onSendClick(e) {
		var input = $('.tab-debug .input');
		var text = input.val();
		input.val('');
		send(text);
	}

	function onInputKeyup(e) {
		if(e.keyCode == 13) {
			$('.tab-debug .send').click();
		}
	}

	function send(text) {
		var data = stringToBuffer(text);
		try {
			chrome.serial.send(connectionId, data, function(sendInfo) {

			});
		} catch(ex) {
			console.dir(ex);
			onSendError();
		}
	}

	function onSendError() {
		appendOutput("send error");
		disconnect(true);
	}

	function onReceive(info) {
		appendOutput(bufferToString(info.data));
	}

	function onReceiveError(info) {
		appendOutput("receive error: " + info.error);
		disconnect(true);
	}

	function appendOutput(str) {
		var output = $('.tab-debug .output');
		var text = output.val();
		output.val(text + str);
	}

	function stringToBuffer(str){
		var buf = new ArrayBuffer(str.length);
		var view = new Uint8Array(buf);
		for(var i = 0; i < str.length; i++){
			view[i] = str.charCodeAt(i);
		}
		return buf;
	}

	function bufferToString(buf) {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	function initTabBurn() {
		$('.tab-burn .selectFile').on('click', onSelectFileClick);
		$('.tab-burn .burn').on('click', onBurnClick);
	}

	function onSelectFileClick(e) {
		// chrome.fileSystem.chooseEntry({type: 'openFile'}, function(entry) {
		// 	entry.file(function(file) {
		// 		var reader = new FileReader();
		// 		reader.onloadend = function(e) {
		// 			hexFileData = e.target.result;
		// 		};

		// 		reader.readAsText(file);
		// 	});
		// });
	}

	function onBurnClick(e) {
		// if(!hexFileData) {
		// 	console.log("没有数据");
		// 	return;
		// }
		// upload.exec(connectionId, hexFileData);

		messages.push({
			action: "authCheck",
			callbacks: ["build", "upload"],
		});
	}

	function disconnect(back) {
		if(connectionId) {
			try {
				chrome.serial.disconnect(connectionId);
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

	function onMessageExternal(message, sender, sendResponse) {
		if(message == "nothing") {
			if(messages.length > 0) {
				sendResponse(messages);
			}
		} else {
			var action = message.action;
			var result = message.result;
			if(action == "init") {
				host = result.host;
			} else if(action == "authCheck") {
				if(!result) {
					showMessage("请先登录");
				}
			} else if(action == "upload") {

			}

			doCallbacks(message.callbacks, sendResponse);
		}
	}

	function doCallbacks(callbacks, sendResponse) {
		if(!callbacks || callbacks.length == 0) {
			return;
		}

		var action = callbacks.shift();
		var message = {
			action: action,
			callbacks: callbacks,
		};
		sendResponse(message);
	}

	return {
		init: init,
	};
});