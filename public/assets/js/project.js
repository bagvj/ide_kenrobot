define(['jquery', 'EventManager', 'util', 'user', 'code', 'hardware', 'software', 'board'], function($, EventManager, util, user, code, hardware, software, board) {
	var projects = [];
	var projectTemplate = '<li data-project-id="{{id}}"><div class="title"><span class="name">{{project_name}}</span><i class="fa"></i></div><div class="view"><div><span class="name">{{project_name}}</span>.uno</div><div><span class="name">{{project_name}}</span>.ino</div></div></li>';


	function init() {
		projects.push(getProjectInfo(0))
		bindProjectEvent(true);
		$('.project .operation li').on('click', onProjectActionClick);

		EventManager.bind("project", "switchPanel", onSwitchPanel);
	}

	function load() {
		user.authCheck(function() {
			$.ajax({
				url: '/projects/' + user.getUserId(),
				dataType: 'json',
			}).done(onLoadSuccess);
		});
	}

	function onLoadSuccess(result) {
		if(result.status != 0) {
			console.log(result.message);
			return;
		}

		var data = result.data;
		if(data.length == 0) {
			return;
		}

		projects = data;
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
		var projectInfo = getCurrentProject();
		$('input[name="name"]', form).val(projectInfo.project_name);
		$('textarea[name="intro"]', form).val(projectInfo.project_intro);
		$('input[name="public-type"]', form).val(projectInfo.public_type);

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
		var boardInfo = board.getCurrentBoard();
		var projectData = {
			model: hardware.getModel(),
			source: software.getSource(),
			boardId: boardInfo.id,
		}
		var form = $('#save-dialog form');
		var project = {
			id: id,
			project_name: $('input[name="name"]', form).val(),
			user_id: user.getUserId(),
			project_intro: $('textarea[name="intro"]', form).val(),
			project_data: JSON.stringify(projectData),
			public_type: parseInt($('input[name="public-type"]', form).val()),
		}
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
				}).done(doUpdateProject);
			}
		});
	}

	function doUpdateProject(result) {
		if(result.status != 0) {
			util.message(result.message);
			return;
		}

		var projectInfo = result.data;
		var index = -1;
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == projectInfo.id) {
				index = i;
				break;
			}
		}

		var list = $('.project .list > ul > li');
		if(index >= 0) {
			projects[index] = projectInfo;
			var li = list.filter('[data-project-id="' + projectInfo.id + '"]');
			li.find(".name").text(projectInfo.project_name);
		} else {
			projects.push(projectInfo);
			list.parent().append(getProjectHtml(projectInfo));
			bindProjectEvent();
		}
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		var operation = $('.sidebar .project .list').data('operation');
		if(operation == "delete") {

		} else {
			var projectInfo = getCurrentProject()
			var projectData = projectInfo.project_data;
			util.toggleActive(li, null, true);

			var divs = li.find(".view > div");
			if(divs.filter(".active").length == 0) {
				divs.eq(0).click();
			}
		}
	}

	function onProjectFileClick(e) {
		var div = $(this);
		$('.project .list .view div.active').removeClass("active");
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
			software.setSource(code.gen());
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
		}, showLoginDialog);
	}

	function onProjectDeleteClick(e) {
		var callback = function() {
			var okFunc = function() {
				doProjectDelete();
			};
			util.confirm({
				title: "删除确认",
				text: "删除后不可恢复，确定要删除该项目吗？",
				okFunc: okFunc,
			});
		};
		user.authCheck(callback, showLoginDialog);
	}

	function doProjectDelete() {
		$.ajax({
			type: "POST",
			url: "/project/delete",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.msg);
			if (result.code == 0) {
				
			}
		});
	}

	function onProjectCancelClick(e) {

	}

	function onProjectConfirmClick(e) {

	}

	function bindProjectEvent(isInit) {
		$('.project .list .view > div').on('click', onProjectFileClick);
		var tiltes = $('.project .list .title').on('click', onProjectTitleClick);
		if(isInit) {
			tiltes.eq(0).click();
		}
	}

	function onSwitchPanel(index) {
		$('.project .list .view > div.active').parent().find("div").eq(index).click();
	}

	function getCurrentProject() {
		var id = $('.project .list > ul > li.active').data('project-id');
		return getProjectInfo(id);
	}

	function getProjectHtml(projectInfo) {
		return projectTemplate.replace(/\{\{project_name\}\}/g, projectInfo.project_name)
							  .replace(/\{\{id\}\}/g, projectInfo.id);
	}

	function getProjectInfo(id) {
		if(id == 0) {
			return {
				id: 0,
				project_name: "我的项目",
				project_intro: "我的项目简介",
				public_type: 1,
				project_data: {},
			};
		}

		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				return info;
			}
		}

		return null;
	}

	return {
		init: init,
		load: load,
		showSaveDialog: showSaveDialog,
	}
});