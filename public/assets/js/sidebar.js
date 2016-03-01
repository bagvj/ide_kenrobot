define(['jquery', 'util', 'user', 'project', 'board', 'software'], function($, util, user, project, board, software) {
	function init() {
		$('.sidebar .logo').on('click', onLogoClick);

		$('.sidebar .bar ul > li').on('click', onSidebarClick).filter('[data-action="component"]').click();
	}

	function onLogoClick(e) {
		user.authCheck(function() {
			util.message("你已登录");
		}, user.showLoginDialog);
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
			case "share":
				onShareClick();
				break;
			default:
				var tab = $('.sidebar .tab.tab-' + action);
				util.toggleActive(li, null, true);
				util.toggleActive(tab, ".tab", true);
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
		var currentBoard = board.getCurrentBoard();

		$.ajax({
			type: "POST",
			url: "/build",
			data: {
				source: software.getSource(),
				user_id: user.getUserId(),
				project: projectName,
				build_type: "Arduino",
				board: currentBoard.board_type,
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.msg);
			if (result.code == 0 && result.url) {
				window.open(result.url);
			}
		});
	}

	function onShareClick() {

	}

	return {
		init: init,
	}
});