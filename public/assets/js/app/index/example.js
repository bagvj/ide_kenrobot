define(['vendor/jquery', 'vendor/meld', './util', './EventManager', './project', './guide'], function(_, meld, util, EventManager, project, guide) {
	var libraries;

	function init() {
		$('.example .list > li li').on('click', onExampleClick);

		EventManager.bind('guide', 'start', onGuideStart);
		EventManager.bind('guide', 'stop', onGuideStop);
	}

	function get(id) {
		return $.ajax({
			type: 'POST',
			url: '/api/example',
			data: {
				id: id
			},
			dataType: 'json',
		});
	}

	function onExampleClick(e) {
		var li = $(this);
		var id = li.data('id');

		if(project.isOpen(id, true)) {
			return;
		}

		get(id).done(function(result) {
			if(result.error) {
				util.message(result.message);
				return;
			}

			project.loadExample(result);
		});
	}

	function onGuideStart(demoId) {
		if(demoId == 1) {
			onExampleClick = meld.after(onExampleClick, function() {
				var index = guide.getStep();
				var text = $(this).text();
				if(index == 0 && text == "Blink") {
					guide.nextStep();
				}
			});

			$('.example .list > li li').off('click').on('click', onExampleClick);
		}
	}

	function onGuideStop(demoId) {
		if(demoId == 1) {
			onExampleClick = util.aspectReset(onExampleClick);
			$('.example .list > li li').off('click').on('click', onExampleClick);
		}
	}

	return {
		init: init,
	}
});