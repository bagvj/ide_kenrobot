define(['vendor/jquery', 'vendor/jquery-ui', './EventManager', './util'], function(_, _, EventManager, util) {
	var isDisplay;
	var container;
	var dragHandle;
	var containerHeight = 200;

	function init() {
		container = $(".bottom-container");
		dragHandle = $('.drag-handle', container);
		dragHandle.draggable({
			axis: 'y',
			drag: function(e, ui) {
				return resizeCheck(e, ui);
			},
			start: function(e, ui) {
				if(!resizeCheck(e, ui)) {
					return false;
				}
				dragHandle.addClass('active');
			},
			stop: function() {
				dragHandle.removeClass('active');
				onResize();
			}
		});

		EventManager.bind("bottomContainer", "toggle", onToggle);
	}

	function isShow() {
		return isDisplay;
	}

	function show() {
		if(isShow()) {
			return;
		}
		
		var delay = 100;
		var easing = "easeOutExpo";

		$(".main-wrap").animate({
			bottom: containerHeight,
		}, delay, easing);

		isDisplay = true;
		container.addClass("active").animate({
			height: containerHeight,
		}, delay, easing);
	}

	function hide(fromChild) {
		if(!isShow()) {
			return;
		}

		var delay = 100;
		var easing = "easeOutExpo";
		$(".main-wrap").animate({
			bottom: 0,
		}, delay, easing);

		isDisplay = false;
		container.animate({
			height: 0,
		}, delay, easing, function() {
			container.removeClass("active");
		});

		if(!fromChild) {
			EventManager.trigger("bottomContainer", "hide");
		}
	}

	function toggle() {
		if(container.is(':animated')) {
			return;
		}

		isShow() ? hide() : show();
	}

	function onToggle(value) {
		if(isShow() == value) {
			return;
		}

		value ? show() : hide();
	}

	function resizeCheck(e, ui) {
		var height = containerHeight - ui.position.top;
		return height >= 150 && height <= 300;
	}

	function onResize() {
		var pos = dragHandle.position();
		var height = container.height();
		containerHeight = height - pos.top;
		container.height(containerHeight);
		dragHandle.removeAttr('style');
		$(".main-wrap").css({
			bottom: containerHeight
		});
	}

	return {
		init: init,
		isShow: isShow,
		show: show,
		hide: hide,
		toggle: toggle,
	}
});