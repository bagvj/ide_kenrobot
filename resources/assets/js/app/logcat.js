define(['vendor/jquery', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', './EventManager', './util', './bottomContainer'], function(_, _, _, _, _, _, _, EventManager, util, bottomContainer) {
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

		EventManager.bind('bottomContainer', "hide", hide);

		hasInit = true;
	}

	function show() {
		init();

		bottomContainer.show();

		if(!tab.hasClass("active")) {
			util.toggleActive(tab);
		}
	}

	function hide() {
		init();
		bottomContainer.hide(true);

		tab.removeClass("active");
	}

	function toggle() {
		init();

		tab.hasClass("active") ? hide() : show();
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

	return {
		show: show,
		hide: hide,
		toggle: toggle,
		append: append,
		clear: clear,
	}
});