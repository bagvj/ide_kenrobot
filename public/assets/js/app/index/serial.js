define(['vendor/jquery', './EventManager', './util', './config', './ext/agent'], function(_, EventManager, util, config, agent) {
	var rateSelector;
	var portSelector;
	var nameReg;

	function init() {
		EventManager.bind('serial', 'refreshPort', refreshPort);
		rateSelector = $('.top-menu .baudRate > ul');
		portSelector = $('.top-menu .port > ul');

		$('li', rateSelector).on('click', onBaudRateClick);
		$('li', portSelector).on('click', onPortClick);

		nameReg = config.serial.nameReg;

		setBaudRate(config.serial.baudRate);
		refreshPort();
	}

	function getBaudRate() {
		return parseInt($('li.checked', rateSelector).data('rate'));
	}

	function getPort() {
		return $('li.checked', portSelector).data('port');
	}

	function refreshPort(showTips) {
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

					var message = "找不到串口";
					showTips && util.message(message);
					promise.reject({
						status: 1,
						message: message
					});
				} else {
					var oldPort = getPort();
					var oldIndex = -1;

					portSelector.empty();
					var count = 0;
					var index;
					for (var i = 0; i < ports.length; i++) {
						var port = ports[i];
						$('<li>').attr("title", port.displayName).attr("data-port", port.path).append('<i class="check kenrobot ken-check"></i>' + port.path).appendTo(portSelector);
						if(nameReg.test(port.path) || (port.displayName && nameReg.test(port.displayName))) {
							count++;
							index = i;
						}
						if(oldPort && oldPort == port.path) {
							oldIndex = i;
						}
					}

					$('li', portSelector).on('click', onPortClick);
					if (count == 1) {
						//有且仅有一个arduino设置连接
						setPort(ports[index].path);
						promise.resolve();
					} else if(oldIndex >= 0) {
						setPort(ports[oldIndex].path);
						promise.resolve();
					} else {
						var message = "请在“工具->端口”中设置串口";
						showTips && util.message(message);
						promise.reject({
							status: 2,
							message: message,
						});
					}
				}
			});
		};

		doCheck();

		return promise;
	}

	function setBaudRate(baudRate) {
		$('li[data-rate="' + baudRate + '"]', rateSelector).click();
	}


	function setPort(port) {
		$('li[data-port="' + port + '"]', portSelector).click();	
	}

	function onBaudRateClick(e) {
		var li = $(this);
		util.toggleActive(li, null, "checked");
	}

	function onPortClick(e) {
		var li = $(this);
		util.toggleActive(li, null, "checked");
	}

	return {
		init: init,
		getBaudRate: getBaudRate,
		getPort: getPort,

		refreshPort: refreshPort,
	}
});