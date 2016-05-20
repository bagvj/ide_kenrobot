define(['vendor/jquery', 'vendor/jquery-ui', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', './EventManager', './util'], function(_, _, _, _, _, _, _, _, EventManager, util) {
	var isDisplay;
	var container;
	var logcat;
	var dragHandle;
	var containerHeight = 150;

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

		logcat = ace.edit($('.logcat', container)[0]);
		logcat.setShowPrintMargin(false);
		logcat.$blockScrolling = Infinity;
		logcat.setReadOnly(true);
		logcat.setHighlightActiveLine(false);
		logcat.setTheme("ace/theme/default");
		logcat.session.setMode("ace/mode/arduino");
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
		}, delay, easing, function() {
			EventManager.trigger("global", 'resize');
		});
	}

	function hide() {
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
			EventManager.trigger("global", 'resize');
		});
	}

	function toggle() {
		if(container.is(':animated')) {
			return;
		}

		isShow() ? hide() : show();
	}

	function append(log) {
		var oldValue = logcat.getValue();
		if(oldValue != "") {
			oldValue = oldValue + "\n";
		} 
		logcat.setValue(oldValue + log, -1);
	}

	function clear() {
		logcat.setValue('');
	}

	function resizeCheck(e, ui) {
		var height = containerHeight - ui.position.top;
		return height >= 100 && height <= 300;
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
		logcat.resize(true);
		EventManager.trigger("global", 'resize');
	}

	return {
		init: init,
		isShow: isShow,
		show: show,
		hide: hide,
		toggle: toggle,
		append: append,
		clear: clear,
	}
});