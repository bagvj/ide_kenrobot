define(['vendor/jquery', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/theme-default', 'vendor/ace/theme-chrome', 'vendor/ace/theme-clouds', 'vendor/ace/theme-eclipse', 'vendor/ace/theme-github', 'vendor/ace/theme-monokai', 'vendor/ace/theme-terminal', 'vendor/ace/theme-textmate', 'vendor/ace/theme-tomorrow', 'vendor/ace/theme-xcode', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', './EventManager', './util', './bottomContainer'], function(_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, EventManager, util, bottomContainer) {
	var logcat;
	var tab;

	function init() {
		tab = $('.bottom-container .tab-logcat');
		logcat = ace.edit($('.logcat', tab)[0]);
		logcat.setShowPrintMargin(false);
		logcat.$blockScrolling = Infinity;
		logcat.setReadOnly(true);
		logcat.setHighlightActiveLine(false);
		logcat.setTheme("ace/theme/default");
		logcat.session.setMode("ace/mode/arduino");

		EventManager.bind('bottomContainer', "hide", hide);
		EventManager.bind("setting", "change", onSettingChange);
	}

	function show() {
		bottomContainer.show();

		if(!tab.hasClass("active")) {
			util.toggleActive(tab);
		}
	}

	function hide() {
		bottomContainer.hide(true);

		tab.removeClass("active");
	}

	function toggle() {
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

	function onSettingChange(option) {
		switch(option.type) {
			case "editor.theme":
				logcat.setTheme("ace/theme/" + option.value);
				break;
			case "editor.tabSize":
				logcat.getSession().setTabSize(option.value);
				break;
		}
	}

	return {
		init: init,
		show: show,
		hide: hide,
		toggle: toggle,
		append: append,
		clear: clear,
	};
});