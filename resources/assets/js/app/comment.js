define(['vendor/jquery', './util', './EventManager', './commentApi', './user', './project', './software'], function(_, util, EventManager, commentApi, user, project, software) {
	var store = {};
	var container;
	var commentTemplate = '<div class="comment-item"><div class="left"><img class="photo" src="{{avatar_url}}" /></div><div class="right"><div class="comment-header"><div class="name">{{name}}</div><div class="floor">{{floor}}楼</div></div><div class="comment-content">{{content}}</div><div class="comment-footer"><div class="publish-time">时间：{{created_at}}</div></div></div></div>';
	var lineReferenceTemplate = '<div class="line-reference"><div class="line-num"></div><div class="line-content"></div></div>'
	var getLineTimer;

	function init() {
		EventManager.bind('rightBar', 'onShow', onShow);
		EventManager.bind('rightBar', 'onHide', onHide);

		container = $('.right-bar .tab-comment');
		$('.publish', container).on('click', onPublishClick);
		$('.use-line', container).on('click', onUseLineClick);
		$('.publish-wrap .line', container).on('blur', onLineBlur).on('focus', onLineFocus);

		EventManager.bind('project', 'open', onOpenProject);
	}

	function getComments(projectId) {
		return store[projectId];
	}

	function clear(value) {
		$('.comment-content', container).val('');

		$('.publish-wrap', container).removeClass('expand');
		$('.use-line', container).attr('checked', false);
		$('.publish-wrap .line', container).val('');
		$('.publish-wrap .line-num', container).text('');
		$('.publish-wrap .line-content', container).text('');
	}

	function add(commentInfo) {
		var wrap = $('.tab-wrap', container);

		var commentHtml = commentTemplate.replace(/\{\{avatar_url\}\}/g, commentInfo.avatar_url)
		                                 .replace(/\{\{floor\}\}/g, commentInfo.floor)
										 .replace(/\{\{name\}\}/g, commentInfo.name)
										 .replace(/\{\{content\}\}/g, commentInfo.content)
										 .replace(/\{\{created_at\}\}/g, commentInfo.created_at);
		commentHtml = $(commentHtml);
		if(commentInfo.extra) {
			var extra = commentInfo.extra;
			var lineReferenceHtml = $(lineReferenceTemplate);
			$('.line-num', lineReferenceHtml).text(extra.line);
			$('.line-content', lineReferenceHtml).text(extra.lineContent);
			$(lineReferenceHtml).insertBefore($('.comment-content', commentHtml));
		}

		wrap.append(commentHtml);
	}

	function update(projectId) {
		commentApi.get(projectId).done(function(result) {
			if(result.status != 0) {
				return;
			}

			var comments = result.data;
			var commentInfo;
			for(var i = 0; i < comments.length; i++) {
				commentInfo = comments[i];
				if(commentInfo.extra) {
					try {
						commentInfo.extra = JSON.parse(commentInfo.extra);
					} catch(ex) {
						commentInfo.extra = null;
					}
				}
				add(comments[i]);
			}
			store[projectId] = comments;
		});
	}

	function displayLine(line) {
		var lineNum = $('.publish-wrap .line-num', container);
		var lineContent = $('.publish-wrap .line-content', container);

		if(!line || line <= 0) {
			lineNum.text('');
			lineContent.text('');
		} else {
			lineNum.text(line);
			var content = $.trim(software.getLine(line - 1));
			lineContent.text(content);
		}
	}

	function onShow(action) {
		if(action != "comment") {
			return;
		}

		onOpenProject();
	}

	function onHide(action) {
		if(action != "comment") {
			return;
		}
	}

	function onUseLineClick(e) {
		if($(this).is(':checked')) {
			$('.publish-wrap', container).addClass('expand');
			$('.publish-wrap .line', container).stop().delay(300).focus();
		} else {
			$('.publish-wrap', container).removeClass('expand');
		}
	}

	function onLineBlur(e) {
		clearInterval(getLineTimer);
		displayLine(getLineNum());
	}

	function onLineFocus(e) {
		var oldLine;
		var line;
		getLineTimer = setInterval(function() {
			line = getLineNum();
			if(!oldLine || oldLine != line) {
				oldLine = line;
				displayLine(line);
			}
		}, 500);
	}

	function getLineNum() {
		return parseInt($('.publish-wrap .line', container).val());
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
			} else if(content.length == 0) {
				util.message("内容为空");
				return;
			}

			var extra = "";
			if($('.use-line', container).is(':checked')) {
				var line = getLineNum();
				if(line && line >= 0) {
					var lineContent = $('.publish-wrap .line-content', container).text();
					extra = {
						line: line,
						lineContent: lineContent
					};
				}
			}
			
			var commentInfo = {
				content: content,
				user_id: user.getUserId(),
				project_id: projectId,
				extra: JSON.stringify(extra),
			};
			commentApi.save(commentInfo).done(function(result) {
				util.message(result.message);
				if(!result.status == 0) {
					return;
				}

				clear();
				if(result.data.extra) {
					try {
						result.data.extra = JSON.parse(result.data.extra);
					} catch(ex) {
						result.data.extra = null;
					}
				}
				add(result.data);
				store[projectId].push(result.data);
				EventManager.trigger('comment', 'refresh');
			});
		};

		user.authCheck().then(doPublish, user.showLoginDialog);
	}

	function onOpenProject() {
		$('.tab-wrap .comment-item', container).remove();
		clear();

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

	return {
		init: init,
		getComments: getComments,
	}
});