define(['jquery', './EventManager', './util', './config', './user', './project', './board', './software', './extAgent'], function($, EventManager, util, config, user, project, board, software, extAgent) {
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
			case "save":
				onSaveClick();
				break;
			case "download":
				onDownloadClick();
				break;
			case "serial":
				onSerialClick();
				break;
			case "burn":
				onBurnClick();
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

	function onSaveClick() {
		user.authCheck(function(success) {
			success ? project.showSaveDialog() : user.showLoginDialog(project.showSaveDialog);
		});
	}

	function onDownloadClick() {
		project.build(function(result) {
			util.message(result.message);
			if (result.status == 0 && result.url) {
				window.location.href = result.url;
			}
		});
	}

	function onSerialClick() {
		extAgent.init(config.extension.debugUrl);
	}

	function onBurnClick() {
		extAgent.init(config.extension.burnUrl);
	}

	return {
		init: init,
	}
});