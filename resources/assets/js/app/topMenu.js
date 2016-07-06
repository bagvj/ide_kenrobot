define(['vendor/jquery', 'vendor/meld', './util', './EventManager', './guide'], function(_, meld, util, EventManager, guide) {
	function init() {
		$('.top-menu > ul li').on('click', onMenuClick);

		EventManager.bind('guide', 'start', onGuideStart);
		EventManager.bind('guide', 'stop', onGuideStop);
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

	function onGuideStart(demoId) {
		if(demoId == 1) {
			// onMenuClick = meld.before(onMenuClick, function(e) {
			// 	var index = guide.getStep();
			// 	var action = $(this).data('action');
			// 	if(index == 1 && action == "save") {
			// 		guide.hideStep();
			// 	} else if(index == 2 && action == "burn") {
			// 		guide.hideStep();
			// 	}
			// });

			// $('.top-menu > ul li').off('click').on('click', onMenuClick);
		}
	}

	function onGuideStop(demoId) {
		if(demoId == 1) {
			// onMenuClick = util.aspectReset(onMenuClick);
			// $('.top-menu > ul li').off('click').on('click', onMenuClick);
		}
	}

	return {
		init: init,
	}
});