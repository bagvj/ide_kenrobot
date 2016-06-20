define(['vendor/jquery', './EventManager', './util'], function(_, EventManager, util) {
	var hasInit;
	var selector = ".setting-dialog";
	var options;

	function init() {
		if(hasInit) {
			return;
		}

		options = {
			theme: "default",
			editor: {
				theme: "default",
			},
		};

		hasInit = true;
		$('.left ul > li', selector).on('click', onTabClick)[0].click();
	}

	function show() {
		init();

		var newOptions;
		var dialog = util.dialog({
			selector: selector,
			onClosing: function() {
				newOptions = getOptions();
			},
			onClose: function() {
				applyOptions(newOptions);
			}
		});
	}

	function getOptions() {
		var opt = {
			theme: "",
			editor: {
				theme: "",
			}
		}

		opt.theme = $('.tab-theme .theme', selector).val();
		opt.editor.theme = $('.tab-editor .code-theme', selector).val();

		return opt;
	}

	function applyOptions(newOptions) {
		if(options.theme != newOptions.theme) {
			options.theme = newOptions.theme;
			EventManager.trigger("setting", "changeTheme", options.theme);
		}

		if(options.editor.theme != newOptions.editor.theme) {
			options.editor.theme = newOptions.editor.theme;
			EventManager.trigger("setting", "changeEditorTheme", options.editor.theme);
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
		show: show,
	}
});