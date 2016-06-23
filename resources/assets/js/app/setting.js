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
		EventManager.bind('setting', 'change', onSettingChange);

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
		$.cookie("setting", JSON.stringify(options), {expires: 365});
	}

	function applyOption(type, value, force) {
		switch(type) {
			case "theme":
				if(force || options.theme != value) {
					options.theme = value;
					EventManager.trigger("setting", "change", {type: type, value: value});
				}
				break;
			case "editor.theme":
				if(force || options.editor.theme != value) {
					options.editor.theme = value;
					EventManager.trigger("setting", "change", {type: type, value: value});
				}
				break;
			case "editor.tabSize":
				if(force || options.editor.tabSize != value) {
					options.editor.tabSize = value;
					EventManager.trigger("setting", "change", {type: type, value: value});
				}
				break;
		}

		if(type == "theme") {
			if((options.theme == "default" && options.editor.theme == "white") || (options.theme == "white" && options.editor.theme == "default")){
				$('.tab-editor .code-theme', selector).val(options.theme);
				applyOption("editor.theme", options.theme, true);
			}
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

	function onSettingChange(option) {
		if(option.type == "theme") {
			var oldTheme = $('body').data('theme');
			$('body').removeClass("theme-" + oldTheme).addClass("theme-" + option.value).data("theme", option.value);
		}
	}

	return {
		init: init,
		show: show,
	}
});