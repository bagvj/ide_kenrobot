define(['vendor/jquery', './util'], function(_, util) {
	var current;
	var boards;
	var list;

	function init() {
		list = $(".top-menu .board ul > li").on('click', onBoardClick);
	}

	function load(_boards) {
		boards = _boards;
		list.eq(0).click();
	}

	function getData() {
		return {
			id: current.id,
			name: current.name,
			board_type: current.board_type,
		};
	}

	function setData(data) {
		data = data || {};
		var id = data.id || 1;

		for (var name in boards) {
			var board = boards[name];
			if (board.id == id) {
				list.filter('[data-board="' + name + '"]').click();
				break;
			}
		}
	}

	function onBoardClick(e) {
		var li = $(this);
		if (li.hasClass("forward")) {
			return;
		}

		var name = li.data("board");
		current = boards[name];
		util.toggleActive(li, null, "checked");
	}

	return {
		init: init,
		load: load,
		getData: getData,
		setData: setData,
	}
});