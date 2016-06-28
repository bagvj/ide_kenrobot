define(['vendor/jquery', './EventManager'], function(_, EventManager) {
	function init() {
		$('.top-menu > ul li').on('click', onMenuClick);
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

	return {
		init: init,
	}
});