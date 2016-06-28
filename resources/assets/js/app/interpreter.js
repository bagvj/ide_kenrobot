define(['vendor/jquery', 'vendor/jquery.terminal', './EventManager', './util', './ext/agent', './serial', './config'], function(_, _, EventManager, util, agent, serial, config) {
	var hasInit;
	var receiveTimer;
	var selector = ".interpreter-dialog";
	var terminal;
	var connectionId;
	var state;
	var hexHasCheck;
	var host;

	var connectBtn;
	var resetBtn;
	var progBtn;
	var runBtn;
	var saveBtn;
	var listBtn;
	var autoRunLabel;
	var autoRun;

	function init() {
		EventManager.bind('interpreter', 'show', onShow);
	}

	function onShow() {
		doInit();
		show();
	}

	function doInit() {
		if(hasInit) {
			return;
		}

		host = window.location.protocol + "//" + window.location.host;
		hasInit = true;

		var btns = $('.top .x-btn', selector);
		connectBtn = btns.filter(".connect");
		resetBtn = btns.filter(".reset");
		progBtn = btns.filter(".prog");
		runBtn = btns.filter(".run");
		saveBtn = btns.filter(".save");
		listBtn = btns.filter(".list");

		$('.top .x-btn', selector).on('click', onButtonClick);

		autoRunLabel = $(".top .auto-run-label", selector);
		autoRun = $(".top .auto-run", selector).on('click', onButtonClick);

		terminal = $('.left .bottom', selector).terminal(function(command, term) {}, {
			greetings: false,
			exit: false,
			numChars: 64,
			onBeforeCommand: function(term, command) {
				onCommand(command);
			}
		});
	}

	function show() {
		EventManager.trigger('bottomContainer', "hide");

		terminal.reset();
		autoRun[0].checked = false;

		refreshBtnState(0);

		util.dialog({
			selector: '.interpreter-dialog',
			onClose: disconnect,
		});

		// if(serial.getPort()) {
		// 	onConnectClick();
		// } else {
			serial.refreshPort(true).done(onConnectClick);
		// }
	}

	function onButtonClick(e) {
		var action = $(this).data('action');
		switch (action) {
			case "connect":
				onConnectClick();
				break;
			case "reset":
				onResetClick();
				break;
			case "advance":
				onAdvanceClick();
				break;
			case "prog":
				var code = $('.right .code', selector).val();
				terminal.exec("prog\n" + code + "\nend\n");
				break;
			case "run":
				terminal.exec("run\n");
				break;
			case "save":
				terminal.exec("save\n");
				break;
			case "list":
				terminal.exec("list\n");
				break;
			case "auto-run":
				var command = autoRun[0].checked ? "autorun\n" : "noauto\n";
				terminal.exec(command);
				break;
		}
	}

	function setEnabled(btn, value) {
		if(value) {
			btn.removeClass("disabled").attr("disabled", false);
		} else {
			btn.addClass("disabled").attr("disabled", true);
		}
	}

	function onConnectClick() {
		if(connectionId) {
			disconnect();
		} else {
			setEnabled(connectBtn, false);
			doConnect().then(function(connId) {
				connectionId = connId;
				setSerialReceive(true);
				refreshBtnState(1);
				connectBtn.val("断开");
				terminal.focus();
			}, function() {
				util.message("连接失败");
				setEnabled(connectBtn, true);
			});
		}
	}

	function onResetClick() {
		if(!connectionId) {
			return;
		}

		agent.sendMessage({
			action: "serial.reset",
		}, function(result) {
			if(!result) {
				disconnect();
				util.message("重置失败");
				return;
			}

			terminal.reset();
			terminal.focus();
		});
	}

	function onAdvanceClick() {
		var dialog = $(selector);
		dialog.clearQueue("expand");
		dialog.clearQueue("fold");

		if(dialog.hasClass("senior")) {
			dialog.addClass("x-fold").delay(300, "fold").queue("fold", function(){
				dialog.removeClass("senior").removeClass("x-fold");
				terminal.focus();
			});
			dialog.dequeue("fold");
		} else {
			dialog.addClass("x-expand").delay(300, "expand").queue("expand", function(){
				dialog.addClass("senior").removeClass("x-expand");
				$('.right .code', dialog).focus();
			});
			dialog.dequeue("expand");
		}
	}

	function onCommand(command) {
		if(!command || command.length == 0) {
			return;
		}

		command = command[command.length - 1] == '\n' ? command : command + '\n';
		agent.sendMessage({
			action: "serial.send",
			data: command,
		}, function(sendInfo) {
			if(!sendInfo || sendInfo.error) {
				disconnect();
				util.message("发送失败");
			}
		});
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

	function disconnect() {
		connectBtn.val("连接");
		refreshBtnState(0);
		terminal.reset();

		setSerialReceive(false);

		if(!connectionId) {
			return;
		}

		agent.sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
		connectionId = null;
		watchProgress(false);
	}

	function setSerialReceive(value) {
		clearInterval(receiveTimer);
		hexHasCheck = false;

		if (value) {
			var checkReceive = function() {
				agent.sendMessage("serial.receive", onSerialReceive);
			}
			receiveTimer = setInterval(checkReceive, config.serial.receiveDelay);

			setTimeout(function() {
				!hexHasCheck && doPrepareHex();
			}, 2000);
		}
	}

	function onSerialReceive(result) {
		if (!result) {
			//接收出错、断开连接
			disconnect();
			return;
		}

		if(result.length == 0) {
			return;
		}

		result = result.join('').replace(String.fromCharCode(65533), "").replace(/\n$/g, "");

		if (!result || result.length == 0 || result == '\n') {
			return;
		}

		if(!checkHex(result)) {
			//没有烧hex文件，取消接收
			doPrepareHex();
			return;
		}

		terminal.echo(result);
	}

	function checkHex(result) {
		if(hexHasCheck) {
			return true;
		}
		hexHasCheck = true;
		if(result.indexOf("2016 KenRobot") < 0) {
			return false;
		}

		refreshBtnState(2);
		return true;
	}

	function doPrepareHex() {
		setSerialReceive(false);

		var hexUrl = "/download/interpreter.hex";
		agent.sendMessage({
			action: "upload",
			url: host + hexUrl,
			delay: config.serial.uploadDelay,
		}, function(result) {
			watchProgress(false);
			if(result) {
				setTimeout(function() {
					$('.x-dialog-title .name', selector).text("啃萝卜");
					util.message("烧写成功");
					disconnect();
					setTimeout(function() {
						onConnectClick();
					}, 200);
				}, 2000);
			} else {
				util.message("烧写失败");
				$('.x-dialog-title .name', selector).text("啃萝卜");
			}
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

	function updateProgress(progress) {
		$('.x-dialog-title .name', selector).text("啃萝卜(正在烧入解释器代码 " + progress + "%)");
	}

	function refreshBtnState(_state) {
		state = _state;

		if(state == 0) {
			setEnabled(connectBtn, true);
			setEnabled(resetBtn, false);
			setEnabled(progBtn, false);
			setEnabled(runBtn, false);
			setEnabled(saveBtn, false);
			setEnabled(listBtn, false);

			setEnabled(autoRunLabel, false);
			setEnabled(autoRun, false);
		} else if(state == 1) {
			setEnabled(connectBtn, true);
			setEnabled(resetBtn, false);
			setEnabled(progBtn, false);
			setEnabled(runBtn, false);
			setEnabled(saveBtn, false);
			setEnabled(listBtn, false);

			setEnabled(autoRunLabel, false);
			setEnabled(autoRun, false);
		} else if(state == 2) {
			setEnabled(connectBtn, true);
			setEnabled(resetBtn, true);
			setEnabled(progBtn, true);
			setEnabled(runBtn, true);
			setEnabled(saveBtn, true);
			setEnabled(listBtn, true);

			setEnabled(autoRunLabel, true);
			setEnabled(autoRun, true);
		}		
	}

	return {
		init: init,
	};
});