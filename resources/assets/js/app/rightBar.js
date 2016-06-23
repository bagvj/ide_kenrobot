define(['vendor/jquery', './util', './EventManager', './comment'], function(_, util, EventManager, comment) {
	var container;
	var isDisplay;
	var containerWidth = 520;
	var barWidth;

	function init() {
		container = $(".right-bar");
		barWidth = $('.bar', container).width();

		$('.bar > ul > li', container).on('click', onBarClick);
		
		comment.init();
	}

	function isShow() {
		return isDisplay;
	}

	function show(action) {
		if(isShow()) {
			return;
		}
		
		container.addClass("active");
		var delay = 100;
		var easing = "easeOutExpo";

		$(".main-content > .wrap").animate({
			right: containerWidth + 2,
		}, delay, easing);

		isDisplay = true;
		$('> .wrap', container).animate({
			width: containerWidth - barWidth,
		}, delay, easing);

		EventManager.trigger("rightBar", "show", action);
	}

	function hide(action) {
		if(!isShow()) {
			return;
		}

		container.removeClass('active');
		var delay = 100;
		var easing = "easeOutExpo";
		$(".main-content > .wrap").animate({
			right: barWidth,
		}, delay, easing, function() {
			$(this).removeAttr('style');
		});

		isDisplay = false;
		$('> .wrap', container).animate({
			width: 0,
		}, delay, easing, function() {
			$(this).removeAttr('style');
		});

		EventManager.trigger("rightBar", "hide", action);
	}

	function onBarClick(e) {
		if(container.is(':animated')) {
			return;
		}

		var li = $(this);
		var action = li.data('action');		
		isShow() ? hide(action) : show(action);
	}

	return {
		init: init,
	}
});