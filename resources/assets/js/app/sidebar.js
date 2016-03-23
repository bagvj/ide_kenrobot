define(['jquery', './EventManager', './util', './config', './user', './project', './board', './software', './ext/agent'], function($, EventManager, util, config, user, project, board, software, agent) {
	function init() {
		$('.sidebar .logo').on('click', onLogoClick);

		$('.sidebar .bar ul > li').on('click', onSidebarClick).filter('[data-action="component"]').click();
	}

	function onLogoClick(e) {
		user.authCheck(function(success) {
			success ? util.message("你已登录") : user.showLoginDialog(null, 1);
		});
	}

	function onSidebarClick(e) {
		var li = $(this);
		var index = li.index();
		var action = li.data("action");
		switch(action) {
			case "format":
				onFormatClick();
				break;
			case "save":
				onSaveClick();
				break;
			case "build":
				onBuildClick();
				break;
			case "burn":
				onBurnClick();
				break;
			case "download":
				onDownloadClick();
				break;
			default:
				var tab = $('.sidebar .tab.tab-' + action);
				util.toggleActive(li, null, true);
				var collapse = util.toggleActive(tab, ".tab", true);
				$(".main > .tabs").css({
					'margin-left': $('.sidebar').width()
				});
				break;
		}
	}

	function onFormatClick() {
		software.format();
	}

	function onSaveClick() {
		project.save();
	}

	function onBuildClick() {
		project.build();
	}

	function onDownloadClick() {
		project.isBuild(function(url) {
			window.location.href = url;
		});
	}

	function onBurnClick() {
		project.isBuild(function(url){
			agent.showBurnDialog(url);
		});
	}

	return {
		init: init,
	}
});