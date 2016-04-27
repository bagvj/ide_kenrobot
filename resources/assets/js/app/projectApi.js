define(['vendor/jquery', './user'], function(_, user) {

	function get(key, type) {
		type = type || "id";

		if(type == "hash") {
			return $.ajax({
				type: 'POST',
				url: '/api/project/get',
				data: {
					user_id: user.getUserId(),
					hash: key,
				},
				dataType: 'json',
			});
		} else {
			return $.ajax({
				type: 'POST',
				url: '/api/project/get',
				data: {
					user_id: user.getUserId(),
					id: key,
				},
				dataType: 'json',
			});
		}
	}

	function getAll() {
		return $.ajax({
			type: 'POST',
			url: '/api/projects/user',
			data: {
			user_id: user.getUserId(),
			},
			dataType: 'json',
		});
	}

	function save(project) {
		return $.ajax({
			type: 'POST',
			url: '/api/project/save',
			data: project,
			dataType: 'json',
		});
	}

	function build(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/build",
			dataType: "json",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
		});
	}

	function remove(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/delete",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
			dataType: "json",
		});
	}

	return {
		get: get,
		getAll: getAll,
		save: save,
		build: build,
		remove: remove,
	};
});