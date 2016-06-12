define(['vendor/jquery', 'vendor/jquery.terminal', './EventManager', './util', './ext/agent', ], function(_, _, EventManager, util, agent) {
	var hasInit;
	var receiveTimer;
	var selector = ".interpreter-dialog";
	var terminal;
	var connectionId;
	var state;

	var connectBtn;
	var resetBtn;
	var progBtn;
	var runBtn;
	var saveBtn;
	var listBtn;
	var autoRunLabel;
	var autoRun;

	function init() {
		if (hasInit) {
			return;
		}

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
		init();

		terminal.reset();
		autoRun[0].checked = false;

		refreshBtnState(0);

		util.dialog({
			selector: '.interpreter-dialog',
			onClose: disconnect,
		});
		onConnectClick();
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
				terminal.exec("prog\n" + code + "\nend");
				break;
			case "run":
				terminal.exec("run");
				break;
			case "save":
				terminal.exec("save");
				break;
			case "list":
				terminal.exec("list");
				break;
			case "auto-run":
				var command = autoRun[0].checked ? "autorun" : "noauto";
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
			checkPorts().done(function() {
				setEnabled(connectBtn, false);
				doConnect().done(function() {
					refreshBtnState(1);
					connectBtn.val("断开");
					terminal.focus();
				}).fail(function() {
					setEnabled(connectBtn, true);
				});
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
		agent.sendMessage({
			action: "serial.send",
			data: command + "\n",
		}, function(sendInfo) {
			if(!sendInfo || sendInfo.error) {
				disconnect();
				util.message("发送失败");
			}
		});
	}

	function checkPorts() {
		var promise = $.Deferred();

		var first = true;
		var doCheck = function() {
			agent.sendMessage("serial.getDevices", function(ports) {
				if (!ports || ports.length == 0) {
					if (first) {
						first = false;
						setTimeout(doCheck, 1000);
						return;
					}

					util.message("找不到串口");
				} else {
					var portList = $('.port-list', selector).empty();
					var count = 0;
					var nameReg = agent.getConfig().nameReg;
					for (var i = 0; i < ports.length; i++) {
						var port = ports[i];
						$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
						if(nameReg.test(port.path) || (port.displayName && nameReg.test(port.displayName))) {
							count++;
						}
					}

					if (count == 1) {
						//有且仅有一个arduino设置连接
						promise.resolve();
					} else {
						util.message("请设置串口");
					}
				}
			});
		};

		doCheck();

		return promise;
	}

	function doConnect() {
		var promise = $.Deferred();

		var portPath = $('.port-list', selector).val();
		var bitRate = agent.getConfig().interpreterBitRate;

		agent.sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(connId) {
			if (connId) {
				//连接成功
				connectionId = connId;
				setSerialReceive(true);
				promise.resolve();
			} else {
				util.message("连接失败");
				promise.reject();
			}
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
	}

	function setSerialReceive(value) {
		clearInterval(receiveTimer);
		if (value) {
			var checkReceive = function() {
				agent.sendMessage("serial.receive", onSerialReceive);
			}
			var config = agent.getConfig();
			receiveTimer = setInterval(checkReceive, config.serialReceiveDelay);
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
		append(result);
	}

	function append(text) {
		if (!text && text.length == 0) {
			return;
		}

		terminal.echo(text);
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
			setEnabled(resetBtn, true);
			setEnabled(progBtn, true);
			setEnabled(runBtn, true);
			setEnabled(saveBtn, true);
			setEnabled(listBtn, true);

			setEnabled(autoRunLabel, true);
			setEnabled(autoRun, true);
		} else if(state == 2) {

		}		
	}

	return {
		show: show,
	};
});