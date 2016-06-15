define(['vendor/jquery', './util', './project'], function(_, util, project) {
	var libraries;

	function init() {
		$('.example .list > li').on('click', onExampleClick);
	}

	function get(name) {
		return $.ajax({
			type: 'POST',
			url: '/api/example',
			data: {
				name: name
			},
			dataType: 'json',
		});
	}

	function onExampleClick(e) {
		var li = $(this);
		var name = li.data('example');

		get(name).done(function(result) {
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