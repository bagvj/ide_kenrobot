define(['jquery', './config'], function($, config) {
	var guideConfig;
	function init() {
		guideConfig = config.guide;

		if(guideConfig.showIfFirstVisit) {
			$('.guide-layer').on('click', function(){
				$(this).remove();
			}).show().delay(3000).queue(function() {
				$(this).remove();
			});
		} else {
			$('.guide-layer').remove();
		}
	}

	return {
		init: init,
	};
});