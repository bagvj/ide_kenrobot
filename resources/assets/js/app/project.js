define(['jquery', './EventManager', './util', './config', './user', './hardware', './software', './board'], function($, EventManager, util, config, user, hardware, software, board) {
	var projects = [];
	var projectTemplate = '<li data-project-id="{{id}}"><div class="title"><span class="name">{{project_name}}</span><i class="iconfont icon-lashenkuangxiangxia"></i></div><div class="view"><div><span class="name">{{project_name}}</span>.uno</div><div><span class="name">{{project_name}}</span>.ino</div></div></li>';
	var curProjectInfo;

	function init() {
		$('.project .operation li').on('click', onProjectActionClick);

		EventManager.bind("project", "switchPanel", onSwitchPanel);
		EventManager.bind("user", "login", onLogin);

		load();
	}

	function build() {
		var doBuild = function() {
			var id = curProjectInfo.id;
			$.ajax({
				type: "POST",
				url: "/project/build",
				dataType: "json",
				data: {
					id: id,
					user_id: user.getUserId(),
				},
			}).done(function(result){
				if(result.status == 0) {
					var projectInfo = getProjectInfo(id);
					projectInfo.status = 2;
					projectInfo.url = result.url;
				}
				util.message(result.message);
			});
		};

		user.authCheck(function(success) {
			success ? doBuild() : user.showLoginDialog();
		});
	}

	function isBuild(callback) {
		var checkBuild = function() {
			var status = curProjectInfo.status;
			var result = {};
			if(!status || status == 0) {
				result.status = -2;
				result.message = "请先保存";
			} else if(status == 1) {
				result.status = -1;
				result.message = "请先编译";
			} else {
				result.status = 0;
				result.message = "编译成功";
				result.url = curProjectInfo.url;
			}
			callback(result);
		};

		user.authCheck(function(success) {
			success ? checkBuild() : user.showLoginDialog();
		});
	}

	function save() {
		var doSave = function() {
			var id = curProjectInfo.id;
			if(id == 0) {
				showSaveDialog(true);
			} else {
				doProjectSave(id);
			}
		};

		user.authCheck(function(success) {
			success ? doSave() : user.showLoginDialog();
		});
	}

	function onSwitchPanel(index) {
		$('.project .list .view > div.active').parent().find("div").eq(index).click();
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
		if(util.toggleActive(li, null, true)) {
			var id = li.data('project-id');
			curProjectInfo = getProjectInfo(id);
			var projectData = curProjectInfo.project_data;

			board.setData(projectData.board);
			hardware.setData(projectData.hardware);
			software.setData(projectData.software);

			var divs = li.find(".view > div");
			if(divs.filter(".active").length == 0) {
				divs.eq(0).click();
			} else {
				divs.filter(".active").click();
			}
		}
	}

	function onProjectFileClick(e) {
		var projectInfo = curProjectInfo;
		var projectData = projectInfo.project_data;
		var div = $(this);
		util.toggleActive(div, 'div')
		var index = div.index();
		var bars = $('.sidebar .bar ul > li');
		var list = $('.sidebar .tab');
		if(index == 0) {
			bars.filter('[data-action="board"],[data-action="component"]').removeClass("hide");
			bars.filter('[data-action="library"],[data-action="format"]').addClass("hide");
			list.filter('.tab-board,.tab-component').removeClass("hide");
			list.filter('.tab-library').addClass("hide");

			var componentBar = bars.filter('[data-action="component"]');
			if(!componentBar.hasClass("active")) {
				componentBar.click();
			}

			projectData.software = software.getData();
			// projectInfo.status = 0;
		} else {
			bars.filter('[data-action="board"],[data-action="component"]').addClass("hide");
			bars.filter('[data-action="library"],[data-action="format"]').removeClass("hide");
			list.filter('.tab-board,.tab-component').addClass("hide");
			list.filter('.tab-library').removeClass("hide");

			var projectBar = bars.filter('[data-action="project"]');
			if(!projectBar.hasClass("active")) {
				projectBar.click();
			}

			projectData.hardware = hardware.getData();
			// projectInfo.status = 0;
			software.gen();
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
		var id = curProjectInfo.id;
		if(id == 0) {
			util.message("你的项目尚未保存");
			return;
		}
		
		user.authCheck(function(success) {
			if(success) {
				util.dialog({
					selector: ".delete-project-dialog",
					okFunc: function() {
						doProjectDelete(id);
					},
				});
			} else {
				user.showLoginDialog();
			}
		});
	}

	function showSaveDialog(isNew) { 
		var projectInfo = isNew ? getDefaultProject() : curProjectInfo;
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
			project = {
				id: id,
				project_name: $('input[name="name"]', form).val(),
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
			curProjectInfo = projectInfo;
			list.append(getProjectHtml(projectInfo));

			bindProjectEvent(-1);
		} else {
			//save
			var index = getProjectIndex(projectInfo.id);
			projects[index] = projectInfo;
			curProjectInfo = projectInfo;

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
		$('.project .list .view > div').off('click').on('click', onProjectFileClick);
		var titles = $('.project .list .title').off('click').on('click', onProjectTitleClick);
		if(typeof id == "number") {
			if(id == -1) {
				titles.eq(titles.length - 1).click();
			} else {
				$('.project .list >  ul > li[data-project-id="' + id + '"] .title').click();
			}
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