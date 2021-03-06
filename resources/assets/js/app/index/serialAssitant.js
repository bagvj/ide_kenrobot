define(['vendor/jquery', './EventManager', './util', './ext/agent', './bottomContainer', './serial', './config'], function(_, EventManager, util, agent, bottomContainer, serial, config) {
	var hasInit;
	var tab;
	var connectionId;
	var state;

	function init() {
		EventManager.bind('bottomContainer', "hide", hide);
		EventManager.bind('serialAssitant', 'toggle', toggle);
	}

	function doInit() {
		if(hasInit) {
			return;
		}

		hasInit = true;
		state = 0;
		refreshControlState();

		tab = $('.bottom-container .tab-serial-assitant');
		$('.serial-tools ul > li, .serial-control > li', tab).on('click', onToolClick);
		$('.send-btn', tab).on('click', onSendClick);
		$('.serial-input .input', tab).on('keyup', onKeyup);
		$('.serial-setting .close-btn').on('click', onSettingClick);
	}

	function show() {
		doInit();

		onClearClick();

		bottomContainer.show();
		if(!tab.hasClass("active")) {
			util.toggleActive(tab);
		}

		agent.check().done(function() {
			// if(serial.getPort()) {
			// 	onPlayClick();
			// } else {
				serial.refreshPort(true).done(onPlayClick);
			// }
		});
	}

	function hide() {
		doInit();

		tab.removeClass("active");
		onStopClick();
		bottomContainer.hide(true);
	}

	function toggle() {
		doInit();

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
			return;
		}

		if($('.line-break', tab).is(':checked')) {
			message = message + '\n';
		}

		serialSend(message);
	}

	function onToolClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "play":
				onPlayClick();
				break;
			case "pause":
				onPauseClick();
				break;
			case "stop":
				onStopClick();
				break;
			case "clear":
				onClearClick();
				break;
			case "setting":
				onSettingClick();
				break;
		}
	}

	function onPlayClick() {
		if(state == 1) {
			return;
		}

		if(state == 0) {
			doConnect();
		} else if(state == 2) {
			state = 1;
		}
		refreshControlState();
	}

	function onPauseClick() {
		if(state != 1) {
			return;
		}
		state = 2;
		refreshControlState();
	}

	function onStopClick() {
		if(state == 0) {
			return;
		}

		agent.sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
		connectionId = null;
		setSerialReceive(false);
		state = 0;
		refreshControlState();
	}

	function refreshControlState() {
		var list = $('.serial-control', tab);
		var play = $('li[data-action="play"]', list);
		var pause = $('li[data-action="pause"]', list);
		var stop = $('li[data-action="stop"]', list);
		if(state == 0) {
			play.addClass("active");
			pause.removeClass("active");
			stop.removeClass('active');
		} else if(state == 1) {
			play.removeClass("active");
			pause.addClass("active");
			stop.addClass('active');
		} else if(state == 2) {
			play.addClass("active");
			pause.removeClass("active");
			stop.addClass('active');
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

	function doConnect() {
		var promise = $.Deferred();

		var portPath = serial.getPort();
		var bitRate = serial.getBaudRate();

		agent.sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(connId) {
			if(connId) {
				//连接成功
				connectionId = connId;
				setSerialReceive(true);

				state = 1;
				refreshControlState();

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
			receiveTimer = setInterval(checkReceive, config.serial.receiveDelay);
		}
	}

	function onSerialReceive(result) {
		if(!result) {
			//接收出错、断开连接
			onStopClick();
			return;
		}

		if(state == 2) {
			//暂停接收串口数据
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
				onStopClick();
				util.message("发送失败");
			}
		});
	}

	return {
		init: init,
		show: show,
		hide: hide,
		toggle: toggle,
	}
});