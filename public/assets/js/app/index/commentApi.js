define(['vendor/jquery'], function() {

	function save(comment) {
		return $.ajax({
			type: 'POST',
			url: '/api/comment/save',
			data: comment,
			dataType: 'json',
		});
	}

	function get(projectId) {
		return $.ajax({
			type: 'POST',
			url: '/api/comment/get',
			data: {
				project_id: projectId
			},
			dataType: 'json',
		});
	}

	function remove(id) {
		return $.ajax({
			type: 'POST',
			url: '/api/comment/delete',
			data: {
				id: id,
			},
			dataType: 'json',
		});
	}

	return {
		save: save,
		get: get,
		remove: remove,
	};
});