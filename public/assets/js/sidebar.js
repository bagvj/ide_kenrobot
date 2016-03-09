define(['jquery', 'EventManager', 'util', 'user', 'project', 'board', 'software'], function($, EventManager, util, user, project, board, software) {
	function init() {
		$('.sidebar .logo').on('click', onLogoClick);

		$('.sidebar .bar ul > li').on('click', onSidebarClick).filter('[data-action="component"]').click();
	}

	function onLogoClick(e) {
		user.authCheck(function() {
			util.message("你已登录");
		}, function() {
			user.showLoginDialog(null, 1);
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
			case "share":
				onShareClick();
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
		user.authCheck(project.showSaveDialog, function() {
			user.showLoginDialog(project.showSaveDialog);
		});
	}

	function onDownloadClick() {
		var projectName = "Arduino";
		var boardInfo = board.getData();
		var softwareData = software.getData();

		$.ajax({
			type: "POST",
			url: "/build",
			data: {
				source: softwareData.source,
				user_id: user.getUserId(),
				project: projectName,
				build_type: "Arduino",
				board: boardInfo.board_type,
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.msg);
			if (result.code == 0 && result.url) {
				window.open(result.url);
			}
		});
	}

	function onSerialClick() {
		if(!window.chrome) {
			util.message("串口调试目前只支持Google Chrome浏览器，其它浏览器敬请期待！");
			return;
		}

		
	}

	function onShareClick() {
		util.message("敬请期待");
	}

	return {
		init: init,
	}
});