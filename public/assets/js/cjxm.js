define(["jquery", "kenrobotDialog", "flowchartInfo"], function($, kenrobotDialog, flowchartInfo) {

	var current_project = null;

	var current_user = 1;

	function init() {
		var uid = $("#kenrobot_uid").val();
		var pid = $("#kenrobot_pid").val();
		if (uid) {
			setCurrentUser(Number(uid));
			if (pid) {
				setCurrentProject(Number(pid));
				var args = {
					"pid": getCurrentPorject()
				}
				flowchartInfo.getFlowchart(args, function(result) {
					projectInfo = result;
				});
			}
		}
	}

	function getCurrentUser() {
		return current_user;
	}

	function setCurrentUser(uid) {
		current_user = uid;
	}

	function getCurrentPorject() {
		return current_project;
	}

	function setCurrentProject(pid) {
		current_project = pid;
	}

	function clearCurrentProject(pid) {
		if (pid == current_project) {
			current_project = null;
		}
	}

	function addProject(data, call, arg) {
		$.ajax({
			type: "POST",
			// url: "./AddProjectInfo.php",
			url: "/project/add",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				//设置本地新建项目ID;
				setCurrentProject(result);
				arg.pid = result;
				call(arg);
			}
		});
	}

	function editProject(data, call, arg) {
		console.log(data)
		$.ajax({
			type: "POST",
			// url: "./EditProjectInfo.php",
			url: "/project/edit",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				call(arg);
			}
		});
	}

	function deleteProject(data, call) {
		$.ajax({
			type: "POST",
			// url: "./DeleteProjectInfo.php",
			url: "/project/del",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				//设置本地新建项目ID;
				clearCurrentProject(data.id);
				call(data);
				alert("删除成功！");
			}
		});
	}

	function getProjectList(data, call) {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});



		$.ajax({
			type: "POST",
			url: "/project/list",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				call(result);
			}
		});
	}

	function getProjectInfo(data, call) {
		$.ajax({
			type: "POST",
			// url: "./GetProjectInfo.php",
			url:"project/info",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				call(result);
			}
		});
	}

	$("#create_project").click(function(e) {
		var name = $("[name=xmmc]").val();
		var desc = $("[name=xmms]").val();
		if (!name) {
			alert("请输入项目名称！");
			return;
		};
		if (!desc) {
			alert("请输入项目描述！");
			return;
		};
		var data = {
			"name": name,
			"scope": 1,
			"user_id": getCurrentUser(),
			"user_name": "xiaoming",
			"status": 1,
			"info": desc
		};
		addProject(data, reqProjectList, data);
		$("[name=xmmc]").val("");
		$("[name=xmms]").val("");
	});


	function reqProjectList(data) {
		var data = {
			"user_id": data.user_id
		};
		getProjectList(data, drawPorjectList);
	}

	function drawPorjectList(data) {
		var li_str = "";
		for (var i = 0; i < data.list.length; i++) {
			li_str += '<li>'
			li_str += '<span>' + data.list[i].name + '</span>'
			li_str += '<div class="operator">'
			li_str += '<div class="btn load" name="' + data.list[i].name + '" value=' + data.list[i].id + '>加载</div>'
			li_str += '<div class="btn del" value=' + data.list[i].id + '>删除</div>'
			li_str += '<div class="btn edit">修改</div></div></li>'
		};
		$(".project_list ul").html(li_str);
		$(".project_list ul li .load").click(function(e) {
			setCurrentProject(Number($(this).attr("value")));
			var args = {
				"pid": getCurrentPorject()
			}
			flowchartInfo.getFlowchart(args, function(result) {
				projectInfo = result;
				alert($(this).attr("name") + "加载成功");
			});
		});
		$(".project_list ul li .del").click(function(e) {
			var pid = Number($(this).attr("value"));
			var data = {
				id: pid,
				user_id: getCurrentUser()
			};
			deleteProject(data, reqProjectList);
		});
	}

	function drawSaveDialog(data, call) {
		var width = 500;
		kenrobotDialog.show(1, {
			"width": width,
			"title": "保存信息",
			"isSplit": 0,
			"contents": [{
				"title": "项目名称",
				"inputType": "text",
				"inputHolder": "",
				"inputInitValue": data.xmmc_init_value,
				"inputKey": "xmmc"
			}, {
				"title": "项目描述",
				"inputType": "textarea",
				"inputHolder": "",
				"inputInitValue": data.xmms_init_value,
				"inputKey": "xmms"
			}, ]
		}, call);
	}

	function saveProjectInfo(data) {
		var name = data.xmmc;
		var desc = data.xmms;
		if (!name) {
			alert("请输入项目名称！");
			return;
		};
		if (!desc) {
			alert("请输入项目描述！");
			return;
		};
		var data = {
			"name": name,
			"scope": 1,
			"user_id": getCurrentUser(),
			"user_name": "xiaoming",
			"status": 1,
			"info": desc
		};
		var pid = getCurrentPorject();
		if (pid == null) {
			addProject(data, flowchartInfo.addFlowchart, {
				"info": projectInfo
			});
		} else {
			data.id = pid;
			editProject(data, flowchartInfo.addFlowchart, {
				"pid": pid,
				"info": projectInfo
			});
		}
	}

	reqProjectList({
		'user_id': 1
	})

	return {
		init: init,
		reqProjectList: reqProjectList,
		getCurrentPorject: getCurrentPorject,
		drawSaveDialog: drawSaveDialog,
		getProjectInfo: getProjectInfo,
		saveProjectInfo: saveProjectInfo,
	}

});