define(['vendor/jquery', './EventManager', './util'], function(_, EventManager, util) {
	var hasInit;
	var selector;

	function init() {
		EventManager.bind('driverDialog', 'show', show);
	}

	function show() {
		doInit();

		util.dialog(selector);
	}

	function doInit() {
		if(hasInit) {
			return;
		}

		hasInit = true;
		selector = $('.arduino-driver-dialog');

		var bit;
		if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
			bit = "64";
		} else {
			bit = "86";
		}
		var downloadUrl = "/download/arduino-driver-x" + bit + ".7z";
		$('.downloadUrl', selector).attr('href', downloadUrl);
	}

	return {
		init: init,
	};
});