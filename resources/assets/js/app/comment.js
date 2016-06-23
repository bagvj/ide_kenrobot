define(['vendor/jquery', './util', './EventManager', './commentApi', './user', './project'], function(_, util, EventManager, commentApi, user, project) {
	var store = {};
	var container;
	var commentTemplate = '<div class="comment-item"><div class="left"><img class="photo" src="{{avatar_url}}" /></div><div class="right"><div class="comment-header"><div class="name">{{reply_user}}</div><div class="floor">{{floor}}</div></div><div class="comment-content">{{content}}</div><div class="comment-footer"><div class="publish-time">时间：{{created_at}}</div></div></div></div>';

	function init() {
		EventManager.bind('rightBar', 'show', onShow);
		EventManager.bind('rightBar', 'show', onHide);

		container = $('.right-bar .tab-comment');
		$('.publish', container).on('click', onPublishClick);
	}

	function clear(value) {
		$('.comment-content', container).val('');

		if(value) {
			$('.tab-wrap .comment-item', container).remove();
		}
	}

	function add(commentInfo) {
		var wrap = $('.tab-wrap', container);

		commentInfo.floor = "";
		commentInfo.avatar_url = "#";
		commentInfo.reply_user = commentInfo.user_id;

		var commentHtml = commentTemplate.replace(/\{\{avatar_url\}\}/g, commentInfo.avatar_url)
		                                 .replace(/\{\{floor\}\}/g, commentInfo.floor)
										 .replace(/\{\{reply_user\}\}/g, commentInfo.user_id)
										 .replace(/\{\{content\}\}/g, commentInfo.content)
										 .replace(/\{\{created_at\}\}/g, commentInfo.created_at);

		wrap.append(commentHtml);
	}

	function update(projectId) {
		commentApi.get(projectId).done(function(result) {
			var comments = result;
			store[projectId] = comments;
			for(var i = 0; i < comments.length; i++) {
				add(comments[i]);
			}
		});
	}

	function onShow(action) {
		if(action != "comment") {
			return;
		}

		clear(true);
		var projectInfo = project.getCurrentProject();
		if(projectInfo.isExamlpe) {
			return;
		}

		var projectId = projectInfo.id;
		var comments = store[projectId];
		if(comments) {
			for(var i = 0; i < comments.length; i++) {
				add(comments[i]);
			}
			return;
		}

		update(projectId);
	}

	function onHide(action) {
		if(action != "comment") {
			return;
		}
	}

	function onPublishClick(e) {
		var doPublish = function() {
			var projectInfo = project.getCurrentProject();
			var projectId = projectInfo.id;
			if(projectInfo.id == 0) {
				util.message('项目未保存，不能评论');
				return;
			}

			if(projectInfo.public_type != 2) {
				util.message('项目未公开，不能评论');
				return;
			}

			if(projectInfo.isExamlpe) {
				util.message('示例项目，不能评论');
				return;
			}

			var content = $('.comment-content', container).val();
			content = $.trim(content);

			if(content.length > 1000) {
				util.message("内容太长了");
				return;
			} else if(content.length < 10) {
				util.message("无效的评论，至少10个非空白字符");
				return;
			}
			
			var commentInfo = {
				content: content,
				user_id: user.getUserId(),
				project_id: projectId,
			};
			commentApi.save(commentInfo).done(function(result) {
				util.message(result.message);
				if(!result.status == 0) {
					return;
				}

				clear();
				add(result.data);
			});
		};

		user.authCheck().then(doPublish, user.showLoginDialog);
	}

	return {
		init: init,
	}
});