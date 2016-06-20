define(['vendor/jquery', './util'], function(_, util) {
	var hasInit;
	var selector = ".setting-dialog";

	function init() {
		if(hasInit) {
			return;
		}

		hasInit = true;
		$('.left ul > li', selector).on('click', onTabClick)[0].click();
	}

	function show() {
		init();

		util.dialog(selector);
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