define(['vendor/jquery', './EventManager', './util', './setting'], function(_, EventManager, util, setting) {

	function init() {
		EventManager.bind("sidebar", "viewChange", onViewChange);
		
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

	return {
		init: init,
		hide: hide,
	}
});