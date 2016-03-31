define(['jquery', './EventManager', './util'], function($, EventManager, util) {

	function init() {
		EventManager.bind("sidebar", "viewChange", onViewChange);
		
		$('.sidebar .bar ul > li').on('click', onSidebarClick).filter('[data-action="project"]').click();
	}

	function isShow() {
		return $('.sidebar .bar ul > li.active').length > 0;
	}

	function hide() {
		$('.sidebar .bar ul > li.active').click();
	}

	function onViewChange(view) {
		var sidebarBtns = $('.sidebar .bar ul > li');
		var sidebarTabs = $('.sidebar .tab');
		if(view == "hardware") {
			sidebarBtns.filter('[data-action="board"],[data-action="component"]').removeClass("hide");
			sidebarBtns.filter('[data-action="library"]').addClass("hide");
			sidebarTabs.filter('.tab-board,.tab-component').removeClass("hide");
			sidebarTabs.filter('.tab-library').addClass("hide");
		} else {
			sidebarBtns.filter('[data-action="board"],[data-action="component"]').addClass("hide");
			sidebarBtns.filter('[data-action="library"]').removeClass("hide");
			sidebarTabs.filter('.tab-board,.tab-component').addClass("hide");
			sidebarTabs.filter('.tab-library').removeClass("hide");
		}

		util.toggleActive($('.main-tabs .tab-' + view), 'div');
	}

	function onSidebarClick(e) {
		var li = $(this);
		var action = li.data("action");
		var tab = $('.sidebar .tab-' + action);
		if(tab.is(':animated')) {
			return;
		}

		var width = tab.data('origin-width');
		if(!width) {
			width = tab.width();
			tab.data("origin-width", width);
		}

		var delay = 100;
		var easing = "easeOutExpo";
		if(tab.hasClass("active")) {
			tab.animate({
				width: 0,
			}, delay, easing, function() {
				util.toggleActive(li, null, true);
				tab.removeClass("active");
			});
		} else {
			$('.sidebar .tab.active').css({
				width: 0
			}).removeClass("active");
			
			tab.addClass("active").animate({
				width: width,
			}, delay, easing, function() {
				util.toggleActive(li, null, true);
			});
		}
	}

	return {
		init: init,
		isShow: isShow,
		hide: hide,
	}
});