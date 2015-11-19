require.config({
	baseUrl: "/assets/js/lib",
	paths: {
		"jquery": "jquery-1.11.2.min",
		"jquery-ui": "jquery-ui-1.11.3.min",
		"jquery-menu": "jquery.contextMenu",
		"jquery-mousewheel": "jquery.mousewheel",
		"jsplumb": "jsPlumb/jsplumb",
		"bootstrap": "bootstrap/bootstrap.min",
		"d3": "d3.min",
		"flowchart_item_set": "../flowchart-item-set",
		"flowchartConfigs": "../flowchartConfigs",
		"genC": "../genC",
		"cjxm": "../cjxm",
		"hardware": "../hardware",
		"software": "../software",
		"kenrobotJsPlumb": "../kenrobotJsPlumb",
		"kenrobotDialog": "../kenrobotDialog",
		"flowchartInfo": "../flowchartInfo",
		"eventcenter": "../eventcenter",
		"html2canvas": "html2canvas.min",
		"defaultJs": "../default",
		"guide": "../guide",
		"keninit": "../keninit",
		'hljs':"../../highlight/highlight.pack",
		'EasterEgg' : "../EasterEgg",
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
		'bootstrap': {
			deps: ['jquery'],
			exports: 'bootstrap'
		},
		'jsplumb': {
			deps: ['jquery'],
			exports: 'jsplumb'
		},
		'jqueryCookie': {
			deps: ['jquery'],
			exports: 'jqueryCookie'
		}
	}
});

// 是否已经初始化
var hasInitedHardware = 0;
var hasInitedSoftware = 0;
//project_info
//本地项目内存地址
var projectInfo = null;
require(['jquery', 'cjxm', 'software', 'hardware', 'kenrobotJsPlumb', 'kenrobotDialog', 'flowchartInfo', 'eventcenter', 'defaultJs', 'guide', 'flowchart_item_set', 'flowchartConfigs', 'genC', 'keninit','hljs','EasterEgg', 'jquery-mousewheel'], function($, cjxm, software, hardware, kenrobotJsPlumb, kenrobotDialog, flowchartInfo, eventcenter, defaultJs, guide, fis, flowchartConfigs, genC, keninit, hljs,EasterEgg) {


	var hundouluo = [38,38,40,40,37,39,37,39,65,66,65,66];
	EasterEgg.listen(hundouluo,function(){
      alert('我不是魂斗罗，你也没有30条命');
    });

	cjxm.init();

	keninit.init();

		//设置ajax请求的csrftoken
		$.ajaxSetup({
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        });
	// 初始化硬件元件
	initHardwareElement(fis);

	defaultJs.init();

	software.initVarTable('var-table');

	genC.init('c_code_input', flowchartConfigs, kenrobotJsPlumb.getFlowchartElements, software.getVarList);

	//拖拽生成的元素列表
	var arrHardware = [];

	// 初始化硬件连接板事件
	eventcenter.bind('hardware', 'init_container', function() {
		if (hasInitedHardware) return false;
		if (hardware.isEmpty()) {
			hardware.init('hardware-item', 'hardware-container');
		}
		hasInitedHardware = 1;
		guide.show(1);
	});

	// 初始化流程图连接板事件
	eventcenter.bind('flowchart', 'init_container', function() {
		var flowchartKind = "flowchart";
		if (arrHardware.length > 0) {
			$("ul", $("div.flowchart_hardware_part_list")).empty();
			for (var i = 0; i < arrHardware.length; i++) {
				// console.log(arrHardware[i]);
				var flowchartObjId = flowchartKind + "_" + arrHardware[i].name + "_" + i;
				var flowchartObjDataItem = flowchartKind + "_" + arrHardware[i].name + "_item";
				var flowchartObjClass1 = flowchartKind + "-item";
				var flowchartObjClass2 = flowchartKind + "-" + arrHardware[i].name;
				var divObj = $("<div></div>").attr("id", flowchartObjId).attr("data-item", flowchartObjDataItem).addClass(flowchartObjClass1).addClass(flowchartObjClass2);
				var liObj = $("<li></li>").append(divObj).append(arrHardware[i].text);
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
			kenrobotJsPlumb.init('flowchart-item', 'flowchart-container');
		}

		hasInitedSoftware = 1;
	});

	// 完成拖拽后激活的事件
	eventcenter.bind('hardware', 'finish_drag', function(args) {
		var kindClass = args.kind + "-item";
		var kindTypeClass = args.kind + "-" + args.name;
		var itemText = args.text;
		var portBit = args.port;
		if (portBit && portBit.length > 0) itemText += "(" + portBit + ")";
		var liObj = $("<li></li>").attr("data-item", args.id).append($("<div></div>").addClass(kindClass).addClass(kindTypeClass)).append(itemText);
		$("ul", $("div.hardware_part_list")).append(liObj);
		//console.log(args)
		arrHardware.push({
			"id": args.id,
			"kind": args.kind,
			"type": args.type,
			"port": args.port,
			"text": itemText,
			"name": args.name
		});
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
		var nodeConfig = flowchartConfigs[nodeName];
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
			"showText": (args.desc.length > 0) ? args.desc : "暂无"
		});

		kenrobotDialog.show(0, {
			"title": "属性设置",
			"contents": contents
		}, saveFlowchartProperty);
	});

	eventcenter.bind('genC', 'refresh', function() {
		genC.refresh();
	});

	function saveFlowchartProperty(data) {
		kenrobotJsPlumb.setSelectedNodeInfo(data);

		genC.refresh();
		//guide
		guide.show(6);
	}

	var hardwareImg = {};
	var flowchartImg = {};

	//保存项目到数据库
	$(".mod_btn .save").click(function(e) {

	});

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
			error: function(result){
				console.log(result);
			}
		});
	});

	function downloadFile(url) {
		window.open(url);
	}

	function initHardwareElement(fis) {
		// 抽离fis中数据，整合成需要的格式
		var jsonHE = {};
		for (var i in fis) {
			if (i.indexOf('hardware_') > -1 && fis[i]['category']) {
				var tmpArray = [];
				if (jsonHE[fis[i]['category']] && jsonHE[fis[i]['category']].length > 0) {
					tmpArray = jsonHE[fis[i]['category']];
				}
				tmpArray.push({
					'name': fis[i]['name'],
					'name_cn': fis[i]['name_cn']
				});
				jsonHE[fis[i]['category']] = tmpArray;
			};
		};
		// 格式化显示顺序
		var showOrder = [{
			key: '控制模块',
			cls: 'kzmk'
		}, {
			key: '输入模块',
			cls: 'srmk'
		}, {
			key: '输出模块',
			cls: 'scmk'
		}, {
			key: '执行模块',
			cls: 'zxmk'
		}, {
			key: '传感模块',
			cls: 'cgmk'
		}];
		$('div.nav-second ul:first', $('.mod:first')).empty();

		// 优先采用顺序话的显示
		for (var i = 0; i < showOrder.length; i++) {
			var key = showOrder[i].key;
			var cls = showOrder[i].cls;
			var tmpArray = jsonHE[key];
			if (tmpArray == undefined || tmpArray.length == 0) {
				continue;
			}

			// 控制模块只有一个时不显示
			if (key.indexOf('控制模块') > -1 && tmpArray.length == 1) {
				continue;
			}
			$('div.nav-second ul:first', $('.mod:first')).append(createUlObj(key, cls, tmpArray));

			delete jsonHE[key];
		};

		// 将非格式化展示的内容在末尾展示，控制模块不在末尾追加
		var tmpIndex = 0;
		var elementCount = 0;
		for (var i in jsonHE) {
			if (i.indexOf("控制模块") > -1) {
				continue;
			}
			$('div.nav-second ul:first', $('.mod:first')).append(createUlObj(i, 'tmp_' + tmpIndex, jsonHE[i]));
			elementCount += jsonHE[i].length;
			tmpIndex++;
		}
		$('li:first', $('div.nav-second ul:first', $('.mod:first'))).addClass('active');

		jsonHE = null;
	}

	function createUlObj(key, cls, arr) {
		var topLiObj = $('<li></li>').addClass(cls);
		topLiObj.append(key).append($('<div></div>').addClass('triangle'));

		var ulObj = $('<ul></ul>');
		var divObj = $('<div></div>').addClass('content-container');

		for (var j = 0; j < arr.length; j++) {
			var name = arr[j].name;
			var name_cn = arr[j].name_cn;
			var tmpLiObj = $('<li></li>');
			var tmpDivObj = $('<div></div>').attr({
				'id': 'hardware_' + name,
				'data-item': 'hardware_' + name + '_item'
			}).addClass('hardware-item').addClass('hardware-' + name);
			tmpLiObj.append(tmpDivObj).append(name_cn);
			divObj.append(tmpLiObj);
		}
		ulObj.append(divObj);
		topLiObj.append(ulObj);

		return topLiObj;
	}
});