define(['vendor/jquery', './util', './commentApi', './user'], function(_, util, commentApi, user) {

	function init() {

	}

	function test() {
		// var info = {
		// 	project_id: 11,
		// 	user_id: user.getUserId(),
		// 	content: "This is a comment for test.",
		// 	comment_id: 2,
		// }

		// commentApi.save(info).done(function(result){
		// 	console.dir(result);
		// }).fail((result) => {
		// 	console.dir(result);
		// });

		// commentApi.get(11).done((result) => {
		// 	console.dir(result);
		// });
	}

	return {
		init: init,
	}
});