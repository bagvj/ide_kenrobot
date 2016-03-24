define(['jquery', './EventManager', './util', './config', './user', './hardware', './software', './board'], function($, EventManager, util, config, user, hardware, software, board) {
	//项目模版
	var projectTemplate = '<li data-project-id="{{id}}"><div class="title"><span class="name">{{project_name}}</span><i class="iconfont icon-lashenkuangxiangxia"></i></div><div class="view"><div><span class="name">{{project_name}}</span>.uno</div><div><span class="name">{{project_name}}</span>.ino</div></div></li>';
	//项目
	var projects = [];
	//状态
	var state;

	function init() {
		$('.project .operation li').on('click', onProjectActionClick);

		EventManager.bind("project", "switchPanel", onSwitchPanel);
		EventManager.bind("user", "login", onLogin);

		load();
	}

	function build() {
		var doBuild = function() {
			var isBuilding = true;
			util.dialog({
				selector: '.building-dialog',
				content: "正在编译，请稍候...",
				onClosing: function() {
					return !isBuilding;
				}
			});
			var info = getCurrentProject();
			var id = info.id;
			$.ajax({
				type: "POST",
				url: "/project/build",
				dataType: "json",
				data: {
					id: id,
					user_id: user.getUserId(),
				},
			}).done(function(result) {
				isBuilding = false;
				if(result.status == 0) {
					var projectInfo = getProjectInfo(result.id);
					projectInfo.status = 2;
					projectInfo.url = result.url;
				}

				var dialog = $('.building-dialog');
				$('.x-dialog-content', dialog).text(result.message);
			});
		};

		user.authCheck(function(success) {
			success ? doBuild() : user.showLoginDialog();
		});
	}

	function isBuild(callback) {
		var checkBuild = function() {
			var projectInfo = getCurrentProject();
			var status = projectInfo.status;
			if(!status || status == 0) {
				util.message("请先保存");
			} else if(status == 1) {
				util.message("请先编译");
			} else {
				callback(projectInfo.url);
			}
		};

		user.authCheck(function(success) {
			success ? checkBuild() : user.showLoginDialog();
		});
	}

	function save() {
		var doSave = function() {
			var projectInfo = getCurrentProject();
			var id = projectInfo.id;
			if(id == 0) {
				showSaveDialog(true);
			} else {
				doProjectSave(id);
			}
		};

		user.authCheck(function(success) {
			(!success) && (state = 0);
			success ? doSave() : user.showLoginDialog();
		});
	}

	function onSwitchPanel(index) {
		$('.project .list li.current .view > div.active').parent().find("div").eq(index).click();
	}

	function onLogin() {
		var projectInfo = getDefaultProject();
		projectInfo.project_data = getProjectData();
		projects = [projectInfo];

		$.ajax({
			url: '/projects/' + user.getUserId(),
			dataType: 'json',
		}).done(onLoadSuccess);
	}

	function load() {
		user.authCheck(function(success) {
			if(success) {
				$.ajax({
					url: '/projects/' + user.getUserId(),
					dataType: 'json',
				}).done(onLoadSuccess);
			} else {
				projects = [getDefaultProject()];
				bindProjectEvent(0);
			}
		});
	}

	function onLoadSuccess(result) {
		if(result.status == 0) {
			projects = result.data.concat(projects);
		} else {
			projects = [getDefaultProject()];
		}

		var ul = $(".project .list ul").empty();
		for(var i = 0; i < projects.length; i++) {
			var projectInfo = projects[i];
			if(typeof projectInfo.project_data == "string") {
				try {
					projectInfo.project_data = JSON.parse(projectInfo.project_data);
				} catch(ex) {
					projectInfo.project_data = {};
				}
			}

			if(projectInfo.status === undefined) {
				projectInfo.status = 1;
			}
			
			ul.append(getProjectHtml(projectInfo));
		}
		bindProjectEvent(-1);
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		util.toggleActive(li, null, true);
	}

	function onProjectFileClick(e) {
		var file = $(this);
		util.toggleActive(file, 'div');
		var index = file.index();
		var sidebarBtns = $('.sidebar .bar ul > li');
		var sidebarTabs = $('.sidebar .tab');
		if(index == 0) {
			sidebarBtns.filter('[data-action="board"],[data-action="component"]').removeClass("hide");
			sidebarBtns.filter('[data-action="library"],[data-action="format"]').addClass("hide");
			sidebarTabs.filter('.tab-board,.tab-component').removeClass("hide");
			sidebarTabs.filter('.tab-library').addClass("hide");

			// var componentBar = sidebarBtns.filter('[data-action="component"]');
			// if(!componentBar.hasClass("active")) {
			// 	componentBar.click();
			// }
		} else {
			sidebarBtns.filter('[data-action="board"],[data-action="component"]').addClass("hide");
			sidebarBtns.filter('[data-action="library"],[data-action="format"]').removeClass("hide");
			sidebarTabs.filter('.tab-board,.tab-component').addClass("hide");
			sidebarTabs.filter('.tab-library').removeClass("hide");

			var projectBar = sidebarBtns.filter('[data-action="project"]');
			if(!projectBar.hasClass("active")) {
				projectBar.click();
			}
		}
		$(".main > .tabs").css({
			'margin-left': $('.sidebar').width(),
		});
		$('.main > .tabs .tab').removeClass("active").eq(index).addClass("active");

		var projectInfo;
		var project_data;
		var projectList = $('.project .list > ul > li');
		var thisLi = file.parent().parent();
		var id = thisLi.data('project-id');

		if(projectList.filter(".current").length == 0) {
			projectInfo = getProjectInfo(id);
			project_data = projectInfo.project_data;

			board.setData(project_data.board);
			hardware.setData(project_data.hardware);
			software.setData(project_data.software);
		} else {
			projectInfo = getCurrentProject();
			
			var currentLi = projectList.filter(".current");
			if(currentLi == thisLi) {
				project_data = projectInfo.project_data;
				if(index == 0) {
					project_data.software = software.getData();
				} else {
					project_data.hardware = hardware.getData();
					software.gen();
				}
			} else {
				projectInfo.project_data = getProjectData();

				projectInfo = getProjectInfo(id);
				project_data = projectInfo.project_data;

				board.setData(project_data.board);
				hardware.setData(project_data.hardware);
				software.setData(project_data.software);
			}
		}

		projectList.filter(".current").removeClass("current");
		thisLi.addClass("current");
	}

	function onProjectActionClick(e) {
		var li = $(this);
		var action = li.data("action");
		switch(action) {
			case "new":
				onProjectNewClick();
				break;
			case "edit":
				onProjectEditClick();
				break;
			case "delete":
				onProjectDeleteClick();
				break;
		}
	}

	function onProjectNewClick(e) {
		user.authCheck(function(success) {
			success ? showSaveDialog(true) : user.showLoginDialog();
		});
	}

	function onProjectEditClick(e) {
		user.authCheck(function(success) {
			success ? showSaveDialog() : user.showLoginDialog();
		});
	}

	function onProjectDeleteClick(e) {
		var projectInfo = getCurrentProject();
		var id = projectInfo.id;
		if(id == 0) {
			util.message("你的项目尚未保存");
			return;
		}
		
		user.authCheck(function(success) {
			if(success) {
				util.dialog({
					selector: ".delete-project-dialog",
					onConfirm: function() {
						doProjectDelete(id);
					},
				});
			} else {
				user.showLoginDialog();
			}
		});
	}

	function showSaveDialog(isNew) { 
		var projectInfo = isNew ? getDefaultProject() : getCurrentProject();
		var text = isNew ? "创建项目" : "保存项目";
		
		var dialog = $('.save-dialog');
		var form = $('form', dialog);
		$('input[name="name"]', form).val(projectInfo.project_name);
		$('textarea[name="intro"]', form).val(projectInfo.project_intro);
		$('input[name="public-type"][value="' + projectInfo.public_type + '"]', form).attr("checked", true);
		$('input[name="save"]', form).val(text);

		var dialogLayer = $('.dialog-layer').addClass("active");
		$('.close-btn', dialog).off('click').on('click', function(e) {
			dialog.slideUp(100);
			dialogLayer.removeClass("active");
		});
		$('.save', dialog).off('click').on('click', function() {
			doProjectSave(projectInfo.id, true);
		});

		dialog.css({
			top: -dialog.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");
	}

	function doProjectSave(id, isEdit) {
		var project;
		if(isEdit) {
			var dialog = $('.save-dialog');
			var form = $('form', dialog);
			var project_name = $('input[name="name"]', form).val();
			for(var i = 0; i < projects.length; i++) {
				var projectInfo = projects[i];
				if(projectInfo.id > 0 && projectInfo.project_name == project_name) {
					util.message("项目名重复");
					return;
				}
			}

			project = {
				id: id,
				project_name: project_name,
				user_id: user.getUserId(),
				project_intro: $('textarea[name="intro"]', form).val(),
				project_data: JSON.stringify(getProjectData()),
				public_type: $("input[name='public-type']:checked", form).val(),
			};
			$('.close-btn', dialog).click();
		} else {
			project = {
				id: id,
				user_id: user.getUserId(),
				project_data: JSON.stringify(getProjectData()),
			}
		}
		
		util.message("正在保存，请稍候...");
		$.ajax({
			type: 'POST',
			url: '/project/save',
			data: project,
			dataType: 'json',
		}).done(function(result) {
			util.message(result.message);
			if(result.status == 0) {
				if(isEdit) {
					$.ajax({
						url: 'project/' + result.data.project_id,
						dataType: 'json',
					}).done(function(res) {
						doUpdateProject(id, res);
					});
				} else {
					var projectInfo = getProjectInfo(id);
					projectInfo.status = 1;
				}
			}
		});
	}

	function doUpdateProject(id, result) {
		if(result.status != 0) {
			util.message(result.message);
			return;
		}

		var projectInfo = result.data;
		projectInfo.status = 1;
		if(typeof projectInfo.project_data == "string") {
			try {
				projectInfo.project_data = JSON.parse(projectInfo.project_data);
			} catch(ex) {
				projectInfo.project_data = {};
			}
		}

		var list = $('.project .list > ul');
		if(id == 0) {
			//new
			list.find('> li[data-project-id="0"]').remove();
			for(var i = 0; i < projects.length; i++){
				var info = projects[i];
				if(info.id == 0) {
					projects.splice(i, 1);
					break;
				}
			}
			
			projects.push(projectInfo);
			list.append(getProjectHtml(projectInfo));

			bindProjectEvent(-1);
		} else {
			//save
			var index = getProjectIndex(projectInfo.id);
			projects[index] = projectInfo;

			list.find('> li[data-project-id="' + projectInfo.id + '"]').find(".name").text(projectInfo.project_name);
		}
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
					var projectInfo = getDefaultProject();
					projects.push(projectInfo);
					$(".project .list > ul").append(getProjectHtml(projectInfo));
					bindProjectEvent(-1);
				} else {
					var titles = $(".project .list .title");
					titles.eq(titles.length - 1).click();
				}
			}
		});
	}

	function bindProjectEvent(id) {
		var titles = $('.project .list .title').off('click').on('click', onProjectTitleClick);
		$('.project .list .view > div').off('click').on('click', onProjectFileClick);
		if(id == -1) {
			var li = titles.eq(titles.length - 1).click().parent();
			var files = $('.view > div', li);
			if(files.filter('.active').length == 0) {
				files.eq(0).click();
			}
		} else {
			$('.project .list >  ul > li[data-project-id="' + id + '"] .title').click();
		}
	}

	function getProjectData() {
		return {
			board: board.getData(),
			hardware: hardware.getData(),
			software: software.getData(),
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
			project_data: {},
			status: 0,
		};
	}

	function getCurrentProject() {
		var id = $('.project .list li.current').data('project-id');
		return getProjectInfo(id);
	}

	function getProjectInfo(id) {
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				return info;
			}
		}
	}

	function getProjectIndex(id) {
		var index = -1;
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				index = i;
				break;
			}
		}
		return index;
	}

	return {
		init: init,
		isBuild: isBuild,
		build: build,
		save: save,
	}
});