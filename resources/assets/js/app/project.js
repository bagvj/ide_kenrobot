define(['vendor/jquery', './EventManager', './util', './user', './hardware', './software', './board', './logcat'], function(_, EventManager, util, user, hardware, software, board, logcat) {
	//项目模版
	var projectTemplate = '<li data-project-id="{{id}}" data-view="software"><div class="title"><i class="kenrobot ken-icon-folder icon"></i><span class="name">{{project_name}}</span><i class="kenrobot arrow"></i></div><div class="view"><div><i class="kenrobot ken-icon-code icon"></i><span class="name">{{project_name}}</span>.ino</div></div></li>';
	var tabTemplate = '<li data-project-id="{{id}}"><span class="name">{{project_name}}</span><i class="kenrobot ken-close close-btn"></i></li>';

	//项目
	var projects = [];
	//状态
	var state;

	function init() {
		$('.project .operation li').on('click', onProjectActionClick);

		EventManager.bind("project", "viewChange", onViewChange);
		EventManager.bind("user", "login", onLogin);
		EventManager.bind("software", "editorChange", onEditorChange);

		load();
	}

	function build() {
		var callback = function() {
			var info = getCurrentProject();
			var id = info.id;
			if(id == 0) {
				showSaveDialog(true);
				return;
			}

			var isBuilding = true;
			var dialog = util.dialog({
				selector: '.building-dialog',
				content: "正在编译，请稍候...",
				onClosing: function() {
					return !isBuilding;
				}
			});

			var doBuild = function() {
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
					} else {
						logcat.show();
						logcat.clear();
						logcat.append(result.output.join("\n"));
					}

					$('.x-dialog-content', dialog).text(result.message);
				});
			};

			if(info.status == 0) {
				doProjectSave(id, false, false, doBuild);
			} else {
				doBuild();
			}
		};

		user.authCheck(function(success) {
			success ? callback() : user.showLoginDialog();
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

	function onViewChange(view) {
		doSwitchView(view);
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

	function onEditorChange() {
		var projectInfo = getCurrentProject();
		projectInfo && (projectInfo.status = 0);
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
				bindProjectEvent();
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
		bindProjectEvent();
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		util.toggleActive(li, null, true);
	}

	function onProjectFileClick(e) {
		var li = $(this).parent().parent();
		var id = li.data('project-id');
		var projectInfo = getProjectInfo(id);
		var ul = $('.top-tabs > ul');

		var targetTab = ul.find('> li[data-project-id="' + id + '"]');
		if(targetTab.length == 0) {
			targetTab = $(tabTemplate.replace(/\{\{project_name\}\}/g, projectInfo.project_name).replace(/\{\{id\}\}/g, projectInfo.id));
			targetTab.appendTo(ul);
			bindTabEvent();
		}

		targetTab.click();
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

		var showDeleteDialog = function() {
			var dialog = util.dialog({
				selector: ".delete-project-dialog",
				onConfirm: function() {
					doProjectDelete(id);
				},
			});

			$('.name', dialog).text(projectInfo.project_name);
		}

		if(id == 0) {
			showDeleteDialog();
			return;
		}
		
		user.authCheck(function(success) {
			if(success) {
				showDeleteDialog();
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

	function doProjectSave(id, isEdit, showMessage, callback) {
		var project;
		showMessage = showMessage != false;
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
		
		showMessage && util.message("正在保存，请稍候...");
		$.ajax({
			type: 'POST',
			url: '/project/save',
			data: project,
			dataType: 'json',
		}).done(function(result) {
			showMessage && util.message(result.message);
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
					callback && callback();
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
			$('.top-tabs > ul > li[data-project-id="0"]').remove();

			for(var i = 0; i < projects.length; i++){
				var info = projects[i];
				if(info.id == 0) {
					projects.splice(i, 1);
					break;
				}
			}
			
			projects.push(projectInfo);
			list.append(getProjectHtml(projectInfo));

			bindProjectEvent();
		} else {
			//save
			var index = getProjectIndex(projectInfo.id);
			projects[index] = projectInfo;

			list.find('> li[data-project-id="' + projectInfo.id + '"]').find(".name").text(projectInfo.project_name);
		}
		software.gen();
	}

	function doProjectDelete(id) {
		var doDelete = function() {
			$('.top-tabs > ul > li[data-project-id="' + id + '"]').remove();
			$('.project .list > ul > li[data-project-id="' + id + '"]').remove();

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
				bindProjectEvent();
			} else {
				var titles = $(".project .list .title");
				titles.eq(titles.length - 1).click();
			}
		};

		if(id == 0) {
			doDelete();
			return;
		}

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
				doDelete();
			}
		});
	}

	function bindProjectEvent() {
		var titles = $('.project .list .title').off('click').on('click', onProjectTitleClick);
		$('.project .list .view > div').off('click').on('click', onProjectFileClick);

		var li = titles.eq(titles.length - 1).click().parent();
		var files = $('.view > div', li);
		if(files.filter('.active').length == 0) {
			files.eq(0).click();
		}
	}

	function bindTabEvent() {
		$('.top-tabs > ul > li').off('click').on('click', onTabClick);
		$('.top-tabs > ul > li .close-btn').off('click').on('click', onTabCloseClick);
	}

	function onTabClick(e) {
		var li = $(this);
		var view = li.data('view');
		var active = li.hasClass("active");

		if(!active) {
			var currentLi = li.parent().find("li.active");
			if(currentLi.length > 0) {
				var currentId = currentLi.data("project-id");
				doSaveView(currentId);
				currentLi.removeClass("active");
			}

			li.addClass("active");
		}
		var projectInfo = getCurrentProject();
		var project_data = projectInfo.project_data;

		board.setData(project_data.board);
		hardware.setData(project_data.hardware);
		software.setData(project_data.software);

		doSwitchView(view);
	}

	function doSwitchView(view) {
		var projectInfo = getCurrentProject();
		var id = projectInfo.id;
		var project_data = projectInfo.project_data

		view = view || "software";
		if(view == "hardware") {
			project_data.software = software.getData();
			hardware.setData(project_data.hardware);
		} else {
			software.gen();
			project_data.hardware = hardware.getData();
		}

		$('.top-tabs > ul > li[data-project-id="' + id + '"]').data("view", view);

		EventManager.trigger("sidebar", "viewChange", view);
	}

	function doSaveView(id) {
		var projectInfo = getProjectInfo(id);
		software.gen();
		projectInfo.project_data = getProjectData();
	}

	function onTabCloseClick(e) {
		var li = $(this).parent();
		var id = li.data('project-id');
		var active = li.hasClass("active");
		
		var index = li.index() - 1;
		index = index < 0 ? 0 : index;

		li.remove();
		doSaveView(id);

		if(active) {
			var list = $('.top-tabs > ul > li');
			if(list.length == 0) {
				$('.main-tabs .tab').removeClass("active");
			} else {
				setTimeout(function() {
					list.eq(index).click();
				}, 10);
			}
		}
		
		return false;
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
		var id = $('.top-tabs > ul > li.active').data('project-id');
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

	function getProjectName() {
		var projectInfo = getCurrentProject();
		return projectInfo ? projectInfo.project_name : "";
	}

	return {
		init: init,
		isBuild: isBuild,
		build: build,
		save: save,
		getProjectName: getProjectName,
	}
});