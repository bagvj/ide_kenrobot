define(['vendor/jquery', './config', './util'], function(_, config, util) {
	var guideConfig;
	function init() {
		guideConfig = config.guide;

		var guideLayer = $('.guide-layer');
		if(guideConfig.showIfFirstVisit) {
			guideLayer.on('click', next).show();
			next();
		} else {
			guideLayer.remove();
		}
	}

	function next() {
		var steps = $('.guide-step');
		var index = steps.filter('.active').index();
		if(index + 1 < steps.length) {
			index = index + 1;
			var nextStep = steps.eq(index);
			util.toggleActive(nextStep);
			if(index + 1 == steps.length) {
				nextStep.css({
					left: ($(window).width() - nextStep.width()) / 2,
				});
			}
		} else {
			$('.guide-layer').remove();
		}
	}

	return {
		init: init,
	};
});