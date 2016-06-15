define(['vendor/jquery', './util', './project'], function(_, util, project) {
	var libraries;

	function init() {
		$('.example .list > li li').on('click', onExampleClick);
	}

	function get(id) {
		return $.ajax({
			type: 'POST',
			url: '/api/example',
			data: {
				id: id
			},
			dataType: 'json',
		});
	}

	function onExampleClick(e) {
		var li = $(this);
		var id = li.data('id');

		if(project.isOpen(id, true)) {
			return;
		}

		get(id).done(function(result) {
			if(result.error) {
				util.message(result.message);
				return;
			}

			project.loadExample(result);
		});
	}

	return {
		init: init,
	}
});