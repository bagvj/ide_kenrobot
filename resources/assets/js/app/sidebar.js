define(['vendor/jquery', 'vendor/meld', './EventManager', './util', './setting', './guide'], function(_, meld, EventManager, util, setting, guide) {

	function init() {
		EventManager.bind("sidebar", "viewChange", onViewChange);
		EventManager.bind('guide', 'start', onGuideStart);
		EventManager.bind('guide', 'stop', onGuideStop);
		
		$('.sidebar .bar ul > li').on('click', onSidebarClick);
	}

	function isShow() {
		return $('.sidebar .bar ul > li.active').length > 0;
	}

	function hide() {
		if(!isShow()) {
			return false;
		}

		bindClickHide();
		$('.sidebar .bar ul > li.active').click();
		
		return true;
	}

	function onViewChange(view) {
		var sidebarBtns = $('.sidebar .bar ul > li');
		var sidebarTabs = $('.sidebar .tab');
		if(view == "hardware") {
			sidebarBtns.filter('[data-action="component"]').removeClass("hide");
			sidebarBtns.filter('[data-action="library"]').addClass("hide");
			sidebarTabs.filter('.tab-component').removeClass("hide");
			sidebarTabs.filter('.tab-library').addClass("hide");
		} else {
			sidebarBtns.filter('[data-action="component"]').addClass("hide");
			sidebarBtns.filter('[data-action="library"]').removeClass("hide");
			sidebarTabs.filter('.tab-component').addClass("hide");
			sidebarTabs.filter('.tab-library').removeClass("hide");
		}

		util.toggleActive($('.main-tabs .tab-' + view));
	}

	function clickHide(e) {
		if(!isShow()) {
			return;
		}

		var li = $(e.target).closest('li');
		if(li.length > 0 && li.parent().parent().hasClass("bar")) {
			return;
		}

		var tab = $(e.target).closest('div.tab');
		if(tab.length > 0 && tab.parent().hasClass("sidebar")) {
			return;
		}

		hide();
	}

	function bindClickHide(value) {
		$(window).off('click', clickHide);
		if(value) {
			$(window).on('click', clickHide);
		}
	}

	function onSidebarClick(e) {
		var li = $(this);
		var action = li.data("action");
		if(action == "setting") {
			setting.show();
			return;
		}

		var tab = $('.sidebar .tab-' + action);
		if(tab.is(':animated')) {
			return;
		}

		var active = tab.hasClass("active");
		if(active) {
			tab.stop().removeClass("x-slideIn").addClass("x-slideOut").delay(150).queue(function() {
				util.toggleActive(li, true);
				tab.removeClass("active").removeClass("x-slideOut");
				bindClickHide();
			});

		} else {
			var activeLi = li.parent().find('li.active');
			var activeAction = activeLi.data('action');
			$('.sidebar .tab.active').stop().removeClass("active").removeClass("x-slideIn").removeClass("x-slideOut");
			
			tab.stop().removeClass("x-slideOut").addClass("active").addClass("x-slideIn").delay(150).queue(function() {
				util.toggleActive(li, true);
				bindClickHide(true);
			});

			if(activeAction == "component") {
				EventManager.trigger("hardware", "adjustTools", false);
			}
		}

		if(action == "component") {
			EventManager.trigger("hardware", "adjustTools", !active);
		}
	}

	function onGuideStart(demoId) {
		if(demoId == 1) {
			// onSidebarClick = meld.before(onSidebarClick, function(e) {
			// 	var index = guide.getStep();
			// 	if(index != 0) {
			// 		return;
			// 	}

			// 	var demo = guide.getDemoConfig(demoId);
			// 	var step = demo.steps[index];
			// 	if($(this)[0] != $(step.target)[0]) {
			// 		return;
			// 	}

			// 	guide.hideStep();
			// });

			// $('.sidebar .bar ul > li').off('click').on('click', onSidebarClick);
		}
	}

	function onGuideStop(demoId) {
		if(demoId == 1) {
			// onSidebarClick = util.aspectReset(onSidebarClick);
			// $('.sidebar .bar ul > li').off('click').on('click', onSidebarClick);
		}
	}

	return {
		init: init,
		hide: hide,
	}
});