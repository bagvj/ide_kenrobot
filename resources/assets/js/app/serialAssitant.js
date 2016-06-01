define(['vendor/jquery', './EventManager', './util', './ext/agent', './bottomContainer'], function(_, EventManager, util, agent, bottomContainer) {
	var hasInit;
	var tab;
	var connectionId;
	var serialReceiveDelay = 1000;

	var nameReg = /(arduino)|(\/dev\/cu\.usbmodem)/i;

	function init() {
		if(hasInit) {
			return;
		}

		tab = $('.bottom-container .tab-serial-assitant');
		$('.serial-tools ul > li', tab).on('click', onToolClick);
		$('.send-btn', tab).on('click', onSendClick);
		$('.serial-input .input', tab).on('keyup', onKeyup);
		$('.serial-setting .close-btn').on('click', onSettingClick);

		EventManager.bind('bottomContainer', "hide", hide);

		hasInit = true;
	}

	function show() {
		init();
		onClearClick();
		
		bottomContainer.show();

		if(!tab.hasClass("active")) {
			util.toggleActive(tab);
		}

		var portList = $('.serial-setting .port', tab).empty();
		agent.sendMessage("serial.getDevices", function(ports) {
			if(!ports || ports.length == 0) {
				//没有串口连接
				return;
			}

			for(var i = 0; i < ports.length; i++) {
				var port = ports[i];
				$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
			}
		});
	}

	function hide() {
		init();
		tab.removeClass("active");

		agent.sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
		connectionId = null;

		bottomContainer.hide(true);
	}

	function toggle() {
		init();

		tab.hasClass("active") ? hide() : show();
	}

	function onKeyup(e) {
		e.keyCode == 13 && onSendClick();
	}

	function onSendClick(e) {
		var input = $('.input', tab);
		var message = input.val();
		input.val('');

		if(!connectionId) {
			agent.check().done(function() {
				var promise = $.Deferred();
				promise.done(function() {
					doConnect().done(function() {
						serialSend(message);
					});
				});
				checkSerialPorts(promise);
			});
		} else {
			serialSend(message);
		}
	}

	function onToolClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "clear":
				onClearClick();
				break;
			case "setting":
				onSettingClick();
				break;
		}
	}

	function onClearClick() {
		var log = $('.log', tab);
		log.val('');
	}

	function onSettingClick() {
 		var setting = $('.serial-setting', tab);
 		if(setting.hasClass("active")) {
 			setting.stop().removeClass("x-fadeIn").addClass("x-fadeOut").delay(300).queue(function() {
 				setting.removeClass("active").removeClass("x-fadeOut");
 			});
 		} else {
 			setting.stop().addClass("active").addClass("x-fadeIn");
 		}
	}

	function append(text) {
		if(!text && text.length == 0) {
			return;
		}

		var log = $('.log', tab);
		var value = log.val();
		log.val(value + text);
		log.scrollTop(log[0].scrollHeight);
	}

	function checkSerialPorts(promise) {
		var portList = $('.serial-setting .port', tab);
		agent.sendMessage("serial.getDevices", function(ports) {
			portList.empty();

			if(!ports || ports.length == 0) {
				//没有串口连接
				setTimeout(function() {
					checkSerialPorts(promise);
				}, 1);
				return;
			}

			var count = 0;
			for(var i = 0; i < ports.length; i++) {
				var port = ports[i];
				$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
				if(port.displayName && nameReg.test(port.displayName)) {
					count++;
				}
			}

			if(count == 1) {
				//有且仅有一个arduino设置连接
				promise.resolve();
			} else {
				var setting = $('.serial-setting', tab);
				if(!setting.hasClass("active")) {
					onSettingClick();
				}

				util.message("请设置串口");
			}
		});
	}

	function doConnect() {
		var promise = $.Deferred();

		var portPath = $('.serial-setting .port', tab).val();
		var bitRate = parseInt($('.serial-setting .bitRate', tab).val());

		agent.sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(_connectionId) {
			if(_connectionId) {
				connectionId = _connectionId;
				setSerialReceive(true);

				promise.resolve();
			} else {
				util.message("连接失败");
			}
		});

		return promise;
	}

	var receiveTimer;
	function setSerialReceive(value) {
		clearInterval(receiveTimer);
		if(value) {
			var checkReceive = function() {
				agent.sendMessage("serial.receive", onSerialReceive);
			}
			receiveTimer = setInterval(checkReceive, serialReceiveDelay);
		}
	}

	function onSerialReceive(result) {
		if(!result) {
			connectionId = null;
			setSerialReceive(false);
			return;
		}

		for(var i = 0; i < result.length; i++) {
			append(result[i]);
		}
	}

	function serialSend(message) {
		agent.sendMessage({
			action: "serial.send",
			data: message,
		}, function(sendInfo) {
			if(!sendInfo || sendInfo.error) {
				connectionId = null;
				setSerialReceive(false);

				util.message("发送失败");
			}
		});
	}

	return {
		show: show,
		hide: hide,
		toggle: toggle,
	}
});