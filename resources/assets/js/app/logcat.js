define(['vendor/jquery', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', './EventManager', './util'], function(_, _, _, _, _, _, _, EventManager, util) {
	var isDisplay;
	var logcat;
	var hasInit;
	var tab;

	function init() {
		if(hasInit) {
			return;
		}

		tab = $('.bottom-container .tab-logcat');
		logcat = ace.edit($('.logcat', tab)[0]);
		logcat.setShowPrintMargin(false);
		logcat.$blockScrolling = Infinity;
		logcat.setReadOnly(true);
		logcat.setHighlightActiveLine(false);
		logcat.setTheme("ace/theme/default");
		logcat.session.setMode("ace/mode/arduino");

		hasInit = true;
	}

	function isShow() {
		return isDisplay;
	}

	function show() {
		if(isShow()) {
			return;
		}
		
		init();

		isDisplay = true;
		EventManager.trigger("bottomContainer", "toggle", true);
		if(!tab.hasClass("active")) {
			util.toggleActive(tab);
		}
	}

	function hide() {
		if(!isShow()) {
			return;
		}

		isDisplay = false;
		EventManager.trigger("bottomContainer", "toggle", false);
		tab.removeClass("active");
	}

	function toggle() {
		isShow() ? hide() : show();
	}

	function append(log) {
		var oldValue = logcat.getValue();
		if(oldValue != "") {
			oldValue = oldValue + "\n";
		} 
		logcat.setValue(oldValue + log, -1);
	}

	function clear() {
		logcat.setValue('');
	}

	function onResize() {
		logcat.resize(true);
	}

	return {
		isShow: isShow,
		show: show,
		hide: hide,
		toggle: toggle,
		append: append,
		clear: clear,
	}
});