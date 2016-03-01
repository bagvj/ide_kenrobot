define(['jquery', 'EventManager', 'util', 'user', 'code', 'hardware', 'software', 'board'], function($, EventManager, util, user, code, hardware, software, board) {
	var projects = [];
	var projectTemplate = '<li data-project-id="{{id}}"><div class="title"><span class="name">{{project_name}}</span><i class="fa"></i></div><div class="view"><div><span class="name">{{project_name}}</span>.uno</div><div><span class="name">{{project_name}}</span>.ino</div></div></li>';
	var curProjectInfo;

	function init() {
		$('.project .operation li').on('click', onProjectActionClick);

		EventManager.bind("project", "switchPanel", onSwitchPanel);

		load();
	}

	function load() {
		user.authCheck(function() {
			$.ajax({
				url: '/projects/' + user.getUserId(),
				dataType: 'json',
			}).done(onLoadSuccess);
		}, function() {
			projects.push(getDefaultProject());
			bindProjectEvent(true);
		});
	}

	function onLoadSuccess(result) {
		console.dir(result);
		if(result.status != 0) {
			projects = [];
		} else {
			projects = result.data;
		}

		if(projects.length == 0) {
			projects.push(getDefaultProject());
		}

		var ul = $(".project .list ul").empty();
		for(var i = 0; i < projects.length; i++) {
			var projectInfo = projects[i];
			ul.append(getProjectHtml(projectInfo));
		}
		bindProjectEvent(true);
	}

	function showSaveDialog(isNew) { 
		var dialog = $('#save-dialog');
		var form = $('form', dialog);
		var projectInfo = isNew ? getDefaultProject() : curProjectInfo;
		$('input[name="name"]', form).val(projectInfo.project_name);
		$('textarea[name="intro"]', form).val(projectInfo.project_intro);
		$('input[name="public-type"][value="' + projectInfo.public_type + '"]', form).attr("checked", true);

		var text = isNew ? "创建项目" : "保存项目";
		$('input[name="save"]', form).val(text);

		$('.close-btn', dialog).off('click').on('click', function(e) {
			dialog.slideUp(100);
			$('.dialog-layer').removeClass("active");
		});
		$('.save', dialog).off('click').on('click', function() {
			doProjectSave(projectInfo.id);
		});

		dialog.css({
			top: -dialog.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");
		$('.dialog-layer').addClass("active");
	}

	function doProjectSave(id) {
		var form = $('#save-dialog form');
		var project = {
			id: id,
			project_name: $('input[name="name"]', form).val(),
			user_id: user.getUserId(),
			project_intro: $('textarea[name="intro"]', form).val(),
			project_data: JSON.stringify(getProjectData()),
			public_type: $("input[name='public-type']:checked", form).val(),
		};

		$('#save-dialog .close-btn').click();
		$.ajax({
			type: 'POST',
			url: '/project/save',
			data: project,
			dataType: 'json',
		}).done(function(result) {
			util.message(result.message);
			if(result.status == 0) {
				$.ajax({
					url: 'project/' + result.data.project_id,
					dataType: 'json',
				}).done(function(res) {
					doUpdateProject(id, res);
				});
			}
		});
	}

	function doUpdateProject(id, result) {
		if(result.status != 0) {
			util.message(result.message);
			return;
		}

		var projectInfo = result.data;
		var list = $('.project .list > ul');
		if(id == 0) {
			//new
			list.find('> li[data-project-id="0"]').remove();
			projects.push(projectInfo);
			list.append(getProjectHtml(projectInfo));
			bindProjectEvent(true);
		} else {
			//save
			var index = -1;
			for(var i = 0; i < projects.length; i++){
				var info = projects[i];
				if(info.id == projectInfo.id) {
					index = i;
					break;
				}
			}
			projects[index] = projectInfo;
			list.find('> li[data-project-id="' + projectInfo.id + '"]').find(".name").text(projectInfo.project_name);
		}
		curProjectInfo = projectInfo;
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		var operation = $('.sidebar .project .list').data('operation');
		if(operation == "delete") {

		} else {
			if(curProjectInfo) {
				curProjectInfo.project_data = getProjectData();
			}
			if(util.toggleActive(li, null, true)) {
				var id = li.data('project-id');
				curProjectInfo = id == 0 ? getDefaultProject() : getProjectInfo(id);
				var projectData = curProjectInfo.project_data;

				board.setCurrentBoard(projectData.boardId);
				hardware.setModel(projectData.model);
				software.setSource(projectData.source);

				var divs = li.find(".view > div");
				if(divs.filter(".active").length == 0) {
					divs.eq(0).click();
				} else {
					divs.filter(".active").click();
				}
			}
		}
	}

	function onProjectFileClick(e) {
		var div = $(this);
		util.toggleActive(div, 'div')
		var index = div.index();
		var bars = $('.sidebar .bar ul > li');
		var list = $('.sidebar .tab');
		if(index == 0) {
			bars.filter('[data-action="board"],[data-action="component"]').removeClass("hide");
			bars.filter('[data-action="library"]').addClass("hide");
			list.filter('.tab-board,.tab-component').removeClass("hide");
			list.filter('.tab-library').addClass("hide");
		} else {
			bars.filter('[data-action="board"],[data-action="component"]').addClass("hide");
			bars.filter('[data-action="library"]').removeClass("hide");
			list.filter('.tab-board,.tab-component').addClass("hide");
			list.filter('.tab-library').removeClass("hide");
		}
		$(".main > .tabs").css({
			'margin-left': $('.sidebar').width()
		});
		$('.main > .tabs .tab').removeClass("active").eq(index).addClass("active");
	}

	function onProjectActionClick(e) {
		var li = $(this);
		var action = li.data("action");
		switch(action) {
			case "new":
				onProjectNewClick();
				break;
			case "delete":
				onProjectDeleteClick();
				break;
			case "cancel":
				onProjectCancelClick();
				break;
			case "confirm":
				onProjectConfirmClick();
				break;
		}
	}

	function onProjectNewClick(e) {
		user.authCheck(function() {
			showSaveDialog(true);
		}, user.showLoginDialog);
	}

	function onProjectDeleteClick(e) {
		if(curProjectInfo.id == 0) {
			util.message("你的项目尚未保存");
			return;
		}
		var callback = function() {
			var okFunc = function() {
				doProjectDelete(curProjectInfo.id);
			};
			util.confirm({
				title: "删除确认",
				text: "删除后不可恢复，确定要删除该项目吗？",
				okFunc: okFunc,
			});
		};
		user.authCheck(callback, user.showLoginDialog);
	}

	function doProjectDelete(id) {
		$.ajax({
			type: "POST",
			url: "/project/delete",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.message);
			if (result.status == 0) {
				var li = $('.project .list > ul > li[data-project-id="' + id + '"]').remove();
				for(var i = 0; i < projects.length; i++) {
					var info = projects[i];
					if(info.id == id) {
						projects.splice(i, 1);
						break;
					}
				}

				if(projects.length == 0) {
					var defaultProjectInfo = getDefaultProject();
					projects.push(defaultProjectInfo);
					$(".project .list > ul").append(getProjectHtml(defaultProjectInfo));
					bindProjectEvent(true);
				} else {
					var tiltes = $(".project .list .title");
					tiltes.eq(tiltes.length - 1).click();
				}
			}
		});
	}

	function onProjectCancelClick(e) {

	}

	function onProjectConfirmClick(e) {

	}

	function bindProjectEvent(isInit) {
		$('.project .list .view > div').off('click').on('click', onProjectFileClick);
		var tiltes = $('.project .list .title').off('click').on('click', onProjectTitleClick);
		if(isInit) {
			tiltes.eq(tiltes.length - 1).click();
		}
	}

	function onSwitchPanel(index) {
		$('.project .list .view > div.active').parent().find("div").eq(index).click();
	}

	function getProjectData() {
		var boardInfo = board.getCurrentBoard();
		return {
			model: hardware.getModel(),
			source: software.getSource(),
			boardId: boardInfo.id,
		};
	}

	function getProjectHtml(projectInfo) {
		return projectTemplate.replace(/\{\{project_name\}\}/g, projectInfo.project_name)
							  .replace(/\{\{id\}\}/g, projectInfo.id);
	}

	function getDefaultProject() {
		return {
			id: 0,
			user_id: user.getUserId(),
			project_name: "我的项目",
			project_intro: "我的项目简介",
			public_type: 1,
			project_data: {
				boardId: 1,
				source: [],
				model: null,
			},
		};
	}

	function getProjectInfo(id) {
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				return info;
			}
		}
	}

	return {
		init: init,
		showSaveDialog: showSaveDialog,
	}
});