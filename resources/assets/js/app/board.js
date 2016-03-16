define(['jquery', './util'], function($, util) {
	var current;
	var boards;
	var selector;

	function init() {
		selector = ".board .list > li.normal";
		$(selector).on('click', onBoardClick);
	}

	function load(_boards) {
		boards = _boards;
		$(selector).eq(0).click();
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

		for(var name in boards) {
			var board = boards[name];
			if(board.id == id) {
				$(selector).filter('[data-board="' + name + '"]').click();
				break;
			}
		}
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
		getData: getData,
		setData: setData,
	}
});