require.config({
	baseUrl: "/assets/js/lib",
	paths: {
		"jquery": "jquery-1.11.2.min",
		"jquery-ui": "jquery-ui-1.11.3.min",
		"jquery-menu": "jquery.contextMenu",
		"jquery-mousewheel": "jquery.mousewheel",
		"jsplumb": "jsplumb",
		// "d3": "d3.min",
		"html2canvas": "html2canvas.min",
		'hljs': "../../highlight/highlight.pack",

		"elementConfig": "../elementConfig",
		"genC": "../genC",
		"hardware": "../hardware",
		"software": "../software",
		"kenrobotJsPlumb": "../kenrobotJsPlumb",
		"kenrobotDialog": "../kenrobotDialog",
		"eventcenter": "../eventcenter",
		"defaultJs": "../default",
		'EasterEgg': "../EasterEgg",
	},
	shim: {
		'jquery-ui': {
			deps: ['jquery'],
			exports: 'jquery-ui'
		},
		'jquery-menu': {
			deps: ['jquery'],
			exports: 'jquery-menu'
		},
		'jquery-mousewheel': {
			deps: ['jquery'],
			exports: 'jquery-mousewheel'
		},
		'jsplumb': {
			deps: ['jquery'],
			exports: 'jsplumb'
		}
	}
});
require(['jquery', 'software', 'hardware', 'kenrobotJsPlumb', 'kenrobotDialog', 'eventcenter', 'elementConfig', 'genC', 'hljs', 'EasterEgg', 'jquery-mousewheel', 'defaultJs'], function($, software, hardware, kenrobotJsPlumb, kenrobotDialog, eventcenter, elementConfig, genC, hljs, EasterEgg, _, defaultJs) {
	// 是否已经初始化
	var hasInitedHardware = 0;
	var hasInitedSoftware = 0;

	var hundouluo = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66, 65, 66];
	EasterEgg.listen(hundouluo, function() {
		alert('我不是魂斗罗，你也没有30条命');
	});

	// 关闭默认右键菜单
	$("body").bind("contextmenu", function(e) {
		var obj = $(e.target);
		if (!obj.hasClass("hardware-container-item") && !obj.hasClass("flowchart-container-item")) {
			return false;
		}
		kenrobotDialog.hide();
	});
	$(".mod .canvas").bind("selectstart", function() {
		return false;
	});

	//设置ajax请求的csrftoken
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	initElements();

	defaultJs.init();

	software.initVarTable('var-table');

	genC.init('c_code_input', elementConfig.flowcharts, kenrobotJsPlumb.getFlowchartElements, software.getVarList);

	//拖拽生成的元素列表
	var arrHardware = [];

	// 初始化硬件连接板事件
	eventcenter.bind('hardware', 'init_container', function() {
		if (hasInitedHardware) return false;
		if (hardware.isEmpty()) {
			hardware.init('hardware-item', 'hardware-container', elementConfig.hardwares);
		}
		hasInitedHardware = 1;
	});

	// 初始化流程图连接板事件
	eventcenter.bind('flowchart', 'init_container', function() {
		var flowchartKind = "flowchart";
		if (arrHardware.length > 0) {
			$("ul", $("div.flowchart_hardware_part_list")).empty();
			for (var i = 0; i < arrHardware.length; i++) {
				var node = arrHardware[i];
				var flowchartObjId = flowchartKind + "_" + node.name + "_" + i;
				var flowchartObjDataItem = flowchartKind + "_" + node.name + "_item";
				var flowchartObjClass1 = flowchartKind + "-item";
				var flowchartObjClass2 = flowchartKind + "-" + node.name;
				var divObj = $("<div>").attr("id", flowchartObjId).attr("data-item", flowchartObjDataItem).attr("title", node.tips).addClass(flowchartObjClass1).addClass(flowchartObjClass2);
				if(node.varName) {
					divObj.attr("data-var-name", node.varName);
				}
				var liObj = $("<li>").append(divObj).append(arrHardware[i].text);
				$("ul", $("div.flowchart_hardware_part_list")).append(liObj);
			}
		}
		if (hasInitedSoftware) {
			//为重新生成的元素提供拖拽支持
			kenrobotJsPlumb.initDraggable('flowchart-item');
			return false;
		}
		//flowchart-container为流程图绘制区域，flowchart-item为即将成为拖拽生成流程图对象的元素，详细参照kenrobotJsPlumb
		if (kenrobotJsPlumb.isEmpty()) {
			kenrobotJsPlumb.init('flowchart-item', 'flowchart-container', elementConfig.flowcharts);
		}

		hasInitedSoftware = 1;
	});

	// 完成拖拽后激活的事件
	eventcenter.bind('hardware', 'finish_drag', function(args) {
		var flowcharts = elementConfig.flowcharts;
		var config = flowcharts[args.name];
		if(!config)
			return;

		var kindClass = "hardware-item";
		var kindTypeClass = "hardware-" + args.name;
		var itemText = args.text;
		var portBit = args.port;
		if (portBit && portBit.length > 0)
			itemText += "(" + portBit + ")";
		console.log("name " + args.name + " tips " + config.tips);
		$("<li>").attr("data-item", args.id).attr("title", config.tips).append($("<div>").addClass(kindClass).addClass(kindTypeClass)).append(itemText).appendTo($("ul", $("div.hardware_part_list")));
		var node = {
			id: args.id,
			kind: args.kind,
			type: args.type,
			port: args.port,
			text: itemText,
			name: args.name,
			tips: config.tips,
		};
		arrHardware.push(node);

		var params = config.params;
		if(!params)
			return;

		for(var i = 0; i < params.length; i++) {
			var param = params[i];
			if(param.increase) {
				var name = software.addVar({
					name: param.defaultValue
				});
				node.varName = name;
				break;
			}
		}		
	});

	// 删除流程元素时激活事件
	eventcenter.bind('hardware', 'finish_remove', function(args) {
		for (var i = 0; i < arrHardware.length; i++) {
			if (arrHardware[i]['id'] == args.id) {
				arrHardware.splice(i, 1);
			}
		}
		$("li[data-item=" + args.id + "]", $("div.hardware_part_list ul")).remove();
	});

	// 点击流程元素时激活的事件
	eventcenter.bind("kenrobot", "flowchart_item_click", function(args) {
		var ids = args.id.split("_");
		var nodeName = ids[1];
		var nodeConfig = elementConfig.flowcharts[nodeName];
		if (nodeConfig === undefined) {
			console.log("unknow node: " + nodeName);
			return;
		}

		if (!nodeConfig.initParams && !nodeConfig.params) {
			//没有参数
			return;
		}

		var contents = [];
		var paramValues = args.add_info;
		if (paramValues) {
			var initParams = nodeConfig.initParams;
			if (initParams) {
				for (var i = 0; i < initParams.length; i++) {
					var param = initParams[i];
					if (!param.autoSet) {
						var paramName = "init_" + param.name;
						var value = paramValues[paramName];
						contents.push({
							"title": param.title,
							"inputType": param.inputType,
							"inputHolder": (param.inputHolder) ? param.inputHolder : "",
							"inputInitValue": value == "" ? param.defaultValue : value,
							"inputKey": paramName
						});
					}
				}
			}

			var params = nodeConfig.params;
			if(params) {
				for (var i = 0; i < params.length; i++) {
					var param = params[i];
					if (!param.autoSet) {
						var value = paramValues[param.name];
						contents.push({
							"title": param.title,
							"inputType": param.inputType,
							"inputHolder": (param.inputHolder) ? param.inputHolder : "",
							"inputInitValue": value == "" ? param.defaultValue : value,
							"inputKey": param.name
						});
					}
				}
			}
		} else {
			var initParams = nodeConfig.initParams;
			if (initParams) {
				for (var i = 0; i < initParams.length; i++) {
					var param = initParams[i];
					if (!param.autoSet) {
						contents.push({
							"title": param.title,
							"inputType": param.inputType,
							"inputHolder": (param.inputHolder) ? param.inputHolder : "",
							"inputInitValue": param.defaultValue,
							"inputKey": "init_" + param.name
						});
					}
				}
			}

			var params = nodeConfig.params;
			if(params) {
				for (var i = 0; i < params.length; i++) {
					var param = params[i];
					if (!param.autoSet) {
						contents.push({
							"title": param.title,
							"inputType": param.inputType,
							"inputHolder": (param.inputHolder) ? param.inputHolder : "",
							"inputInitValue": param.defaultValue,
							"inputKey": param.name
						});
					}
				}
			}
		}

		// if(contents.length == 0) {
		// 	return;
		// }
		
		if (nodeConfig.type == 4) {
			// 端口信息展示处理
			var portText = args.text.substring(args.text.lastIndexOf("(") + 1, args.text.lastIndexOf(")"));
			if (portText.length > 0) {
				$("#prop_set_port_show").text(portText);
			} else {
				$("#prop_set_port_show").text("无");
			}
			contents.push({
				"title": "端口",
				"inputType": "none",
				"fontColor": "#F00",
				"showText": portText
			});
		}

		contents.push({
			"title": "注释",
			"inputType": "none",
			"fontColor": "#BBBDBF",
			"showText": args.desc || "暂无"
		});

		kenrobotDialog.show(0, {
			"title": "属性设置",
			"contents": contents
		}, saveFlowchartProperty);
	});

	eventcenter.bind('genC', 'refresh', function() {
		genC.refresh();
	});

	function saveFlowchartProperty(add_info) {
		kenrobotJsPlumb.saveNodeInfo(add_info);

		genC.refresh();
	}

	//下载
	$('.mod_btn .download').click(function(e) {
		var source = genC.gen();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}
		var projectName = "Rosys";
		var buildType = "Rosys";

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type: "POST",
			url: "./build",
			data: {
				source: bytes,
				projectName: projectName,
				buildType: buildType
			},
			dataType: "json",
			async: true, //异步
			success: function(result) {
				if (result.code == 0 && result.url) {
					downloadFile(result.url);
				} else {
					alert(result.msg);
				}
			},
			error: function(result) {
				console.log(result);
			}
		});
	});

	function downloadFile(url) {
		window.open(url);
	}

	$('.mod_btn .feedback').click(function(e) {
		var contents = [];
		contents.push({
			title: "您的昵称",
			inputType: "text",
			inputKey: "nickname",
		});
		contents.push({
			title: "",
			inputType: "textarea",
			inputKey: "content",
			inputHolder: "您的任何问题或建议"
		});
		contents.push({
			title: "联系方式",
			inputType: "text",
			inputKey: "contact",
			inputHolder: "电话、邮箱或者其它联系方式"
		});

		kenrobotDialog.show(0, {
			title: "反馈",
			contents: contents
		}, function(data) {
			if(data.nickname == "") {
				alert("请输入您的昵称");
				return false;
			}
			if(data.content == "") {
				alert("意见不能为空");
				return false;
			}
			if(data.contact == "") {
				alert("请输入您的联系方式");
				return false;
			}

			$.ajax({
				type: "POST",
				url: "./feedback",
				data: data,
				success: function(result) {
					alert("感谢您的反馈");
				},
				error: function(result) {
					alert("提交失败");
				}
			});
		});
	});

	function initElements() {
		var mods = $('.mod');

		var hardwareGroups = [];
		for (var name in elementConfig.hardwares) {
			var hardware = elementConfig.hardwares[name];
			if (hardware.inUse) {
				var category = hardware.category;
				var group = null;
				for (var i = 0; i < hardwareGroups.length; i++) {
					if (hardwareGroups[i].category == category) {
						group = hardwareGroups[i];
						break;
					}
				}
				if (!group) {
					group = {
						category: category,
						hardwares: []
					};
					hardwareGroups.push(group);
				}
				group.hardwares.push(hardware);
			}
		}
		hardwareGroups = hardwareGroups.sort(function(a, b) {
			return a.category > b.category;
		});

		var categories = ['输入模块', '输出模块', '执行模块', '传感模块', '通讯模块'];
		var hardwareNav = $('.nav-second>ul', mods[0]).empty();
		for (var i = 0; i < hardwareGroups.length; i++) {
			var group = hardwareGroups[i];
			if (group.category > 0) {
				var category = categories[group.category - 1];
				var li = $('<li>').appendTo(hardwareNav);
				$('<div>').addClass('category').append(category).append('<div class="arrow"></div>').appendTo(li);
				var contentDiv = $('<div>');
				for (var j = 0; j < group.hardwares.length; j++) {
					var hardware = group.hardwares[j];
					var name = hardware.name;
					var itemDiv = $('<div>').addClass('hardware-item').addClass('hardware-' + name).attr({
						'id': 'hardware_' + name,
						'data-item': 'hardware_' + name + '_item'
					});
					$('<li>').attr("title", hardware.tips).append(itemDiv).append(hardware.alias).appendTo(contentDiv);
				}
				$('<ul>').append(contentDiv).appendTo(li);
			}
		}
	}
});