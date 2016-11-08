define(['vendor/jquery', 'vendor/jquery.scrollTo', 'vendor/meld', './util', './EventManager'], function(_, _, meld, util, EventManager) {
	function init() {
		$('.top-menu > ul li').on('click', onMenuClick);

		$('.top-menu .select-wrap .slider-arrow').on('mouseover', onArrowMouseHover).on('mouseout', onArrowMouseOut);
	}

	function onMenuClick(e) {
		var li = $(this);
		var action = li.data("action");
		switch(action) {
			case "build":
				EventManager.trigger('project', 'build');
				break;
			case "burn":
				EventManager.trigger('burn', 'show');
				break;
			case "format":
				EventManager.trigger('software', 'format');
				break;
			case "save":
				EventManager.trigger('project', 'save');
				break;
			case "download":
				EventManager.trigger('project', 'download');
				break;
			case "logcat":
				EventManager.trigger('logcat', 'toggle');
				break;
			case "serial-assitant":
				EventManager.trigger('serialAssitant', 'toggle');
				break;
			case "interpreter":
				EventManager.trigger('interpreter', 'show');
				break;
			case "setting":
				EventManager.trigger('setting', 'show');
				break;
		}
	}

	function onArrowMouseHover(e) {
		var arrow = $(this);
		var direction = arrow.data('direction');
		var menu = $('> ul', arrow.parent());

		if(direction == "top") {
			menu.scrollTo('0%', 800);
		} else {
			menu.scrollTo("100%", 800);
		}
	}

	function onArrowMouseOut(e) {
		var arrow = $(this);
		var menu = $('> ul', arrow.parent());
		menu.stop(true);
	}

	return {
		init: init,
	}
});