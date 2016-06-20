define(['vendor/jquery', 'vendor/jquery.cookie', './EventManager', './util'], function(_, _, EventManager, util) {
	var options;
	var selector = ".setting-dialog";
	var defaultOptions = {
		theme: "default",
		editor: {
			theme: "default",
			tabSize: 4,
		},
	};

	function init() {
		$('.left ul > li', selector).on('click', onTabClick)[0].click();

		$('.tab-theme .theme', selector).on('change', function() {
			applyOption("theme", $(this).val());
			saveOptions();
		});

		$('.tab-editor .code-theme', selector).on('change', function() {
			applyOption("editor.theme", $(this).val());
			saveOptions();
		});

		$('.tab-editor .tab-size', selector).on('blur', function() {
			applyOption("editor.tabSize", parseInt($(this).val()));
			saveOptions();
		});

		loadOptions();
	}

	function show() {
		util.dialog(selector);
	}

	function loadOptions() {
		try {
			options = JSON.parse($.cookie("setting"));
		} catch(ex) {
			options = defaultOptions;
		}

		$('.tab-theme .theme', selector).val(options.theme);
		applyOption("theme", options.theme, true);

		$('.tab-editor .code-theme', selector).val(options.editor.theme);
		applyOption("editor.theme", options.editor.theme, true);

		$('.tab-editor .tab-size', selector).val(options.editor.tabSize);
		applyOption("editor.tabSize", options.editor.tabSize, true);
	}

	function saveOptions() {
		$.cookie("setting", JSON.stringify(options));
	}

	function applyOption(type, value, force) {
		switch(type) {
			case "theme":
				if(force || options.theme != value) {
					options.theme = value;
					EventManager.trigger("setting", "change", {type: "theme", value: value});
				}
				break;
			case "editor.theme":
				if(force || options.editor.theme != value) {
					options.editor.theme = value;
					EventManager.trigger("setting", "change", {type: "editor.theme", value: value});
				}
				break;
			case "editor.tabSize":
				if(force || options.editor.tabSize != value) {
					options.editor.tabSize = value;
					EventManager.trigger("setting", "change", {type: "editor.tabSize", value: value});
				}
				break;
		}
	}

	function onTabClick(e) {
		var li = $(this);
		var action = li.data('action');
		util.toggleActive(li);

		var tab = $('.right .tab-' + action, selector);
		util.toggleActive(tab);

		var text = li.text();
		$('.x-dialog-title', selector).text("设置>" + text);
	}

	return {
		init: init,
		show: show,
	}
});