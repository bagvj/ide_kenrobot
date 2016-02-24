define(['jquery', 'util'], function($, util) {
	var current;
	var boards;

	function init() {
		$('.board .list > li').on('click', onBoardClick);
	}

	function load(_boards) {
		boards = _boards;
		$('.board .list > li').eq(0).click();
	}

	function getCurrentBoard() {
		return current;
	}

	function onBoardClick(e) {
		var li = $(this);
		var name = li.data("board");
		current = boards[name];
		util.toggleActive(li);
	}

	return {
		init: init,
		load: load,
		getCurrentBoard: getCurrentBoard,
	}
});