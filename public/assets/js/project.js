define(['jquery', 'util', 'user'], function($, util, user) {
	var projects = [];

	function init() {
		$('.project .list .view > div').on('click', onProjectFileClick);
		$('.project .list .title').on('click', onProjectTitleClick).eq(0).click();
		$('.project .operation li').on('click', onProjectActionClick);
	}

	function load() {
		user.authCheck(function() {
			$.ajax({
				url: '/projects/' + user.getUserId(),
				dataType: 'json',
			}).done(onLoadSuccess);
		});
	}

	function showSaveDialog(isNew) { 
		var projectInfo = getCurrentProject();
		
		var dialog = $('#save-dialog');
		var form = $('form', dialog);
		if(!isNew && projectInfo) {
			$('input[name="name"]', form).val(projectInfo.project_name);
			$('textarea[name="intro"]', form).val(projectInfo.project_intro);
			$('input[name="public-type"]', form).val(projectInfo.public_type);
		} else {
			$('input[name="name"]', form).val("");
			$('textarea[name="intro"]', form).val("");
			$('input[name="public-type"]', form).val(1);
		}
		var text = isNew ? "创建项目" : "保存项目";
		$('input[name="save"]', form).val(text);

		$('.close-btn', dialog).off('click').on('click', function(e) {
			dialog.slideUp(100);
			$('.dialog-layer').removeClass("active");
		});
		$('.save', dialog).off('click').on('click', doProjectSave);

		dialog.css({
			top: -$(this).height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");
		$('.dialog-layer').addClass("active");
	}

	function switchPanel(index) {
		$('.project .list .view > div.active').parent().find("div").eq(index).click();
	}

	function onLoadSuccess(result) {
		if(result.status == 0) {
			projects = result.data;
			console.dir(projects);
			initProjects();
		}
	}

	function initProjects() {
		var template = '<li data-project-id="{{id}}"><div class="title">{{project_name}}<i class="fa"></i></div><div class="view"><div>{{project_name}}.uno</div><div>{{project_name}}.ino</div></div></li>';
		var ul = $(".project .list ul").empty();
		for(var i = 0; i < projects.length; i++) {
			var projectInfo = projects[i];
			var li = template.replace(/\{\{project_name\}\}/g, projectInfo.project_name)
							 .replace(/\{\{id\}\}/g, projectInfo.id);
			ul.append(li);
		}

		$('.project .list .view > div').on('click', onProjectFileClick);
		$('.project .list .title').on('click', onProjectTitleClick).eq(0).click();
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		var operation = $('.sidebar .project .list').data('operation');
		if(operation == "delete") {

		} else {
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
		}
		$(".main > .tabs").css({
			'margin-left': $('.sidebar').width()
		});
		$('.main > .tabs .tab').removeClass("active").eq(index).addClass("active");
	}

	function doProjectSave() {
		var projectData = {
			source: getSource(),
			boardName: board.name,
		}
		var form = $('#save-dialog form');
		var project = {
			id: 0,
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
		}).fail(function(result) {
			util.message(result.message);
		});
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

	function getCurrentProject() {
		if(projects.length > 0) {
			var index = $('.project .list .view > div.active').parent().parent().index();
			return projects[index];
		}
		return null;
	}

	return {
		init: init,
		load: load,
		switchPanel: switchPanel, 
		showSaveDialog: showSaveDialog,
	}
});