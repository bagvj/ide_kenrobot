define(['vendor/jquery', './util', './EventManager'], function(_, util, EventManager) {
	var container;
	var isDisplay;
	var containerWidth = 520;
	var barWidth;

	function init() {
		container = $(".right-bar");
		barWidth = $('.bar', container).width();

		$('.bar > ul > li', container).on('click', onBarClick);
		EventManager.bind('rightBar', 'hide', hide);
	}

	function isShow() {
		return isDisplay;
	}

	function hide() {
		if(!isShow()) {
			return false;
		}

		$('.bar > ul > li.active').click();

		return true;
	}

	function doShow(action) {
		if(isShow()) {
			util.toggleActive($('.tab-' + action, container));
		} else {
			container.addClass("active");
			var mainWrap = $('.main-content > .wrap').addClass('x-right-expand').delay(150, 'right-expand').queue('right-expand', function() {
				mainWrap.addClass('right-expand').removeClass("x-right-expand");
				mainWrap.trigger('reisze');
			});
			mainWrap.dequeue('right-expand');

			isDisplay = true;

			var wrap = $('> .wrap', container).addClass('x-expand').delay(150, 'expand').queue('expand', function() {
				wrap.addClass('active').removeClass("x-expand");
				EventManager.trigger("rightBar", "resize");
			});
			util.toggleActive($('.tab-' + action, container));
			wrap.dequeue('expand');
		}
		EventManager.trigger("rightBar", "onShow", action);
	}

	function doHide(action) {
		if(!isShow()) {
			return;
		}

		container.removeClass('active');

		var mainWrap = $('.main-content > .wrap').addClass('x-right-fold').delay(150, 'right-fold').queue('right-fold', function() {
			mainWrap.removeClass('right-expand').removeClass('x-right-fold');
			mainWrap.trigger('reisze');
		});
		mainWrap.dequeue('right-fold');

		isDisplay = false;
		var wrap = $('> .wrap', container).addClass('x-fold').delay(150, 'fold').queue('fold', function() {
			wrap.removeClass('active').removeClass('x-fold');
			$('.tab-' + action, container).removeClass("active");

			EventManager.trigger("rightBar", "resize");
		});
		wrap.dequeue('fold');

		EventManager.trigger("rightBar", "onHide", action);
	}

	function onBarClick(e) {
		if(container.is(':animated')) {
			return;
		}

		var li = $(this);
		var action = li.data('action');	
		if(li.hasClass('active')) {
			li.removeClass('active');
			doHide(action);
		} else {
			util.toggleActive(li);
			doShow(action);
		}
	}

	return {
		init: init,
		hide: hide,
	}
});