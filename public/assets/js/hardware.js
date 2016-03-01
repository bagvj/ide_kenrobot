define(['jquery', 'goJS', 'nodeTemplate', 'EventManager', 'util'], function($, _, template, EventManager, util) {
	//C++关键字
	var keywords = [
		"asm", "do", "if", "return", "typedef", "auto", "double",
		"inline", "short", "typeid", "bool", "dynamic_cast", "int",
		"signed", "typename", "break", "else", "long", "sizeof", "union",
		"case", "enum", "mutable", "static", "unsigned", "catch", "explicit",
		"namespace", "static_cast", "using", "char", "export",
		"new", "struct", "virtual", "class", "extern", "operator",
		"switch", "void", "const", "false", "private", "template",
		"volatile", "const_cast", "float", "protected", "this",
		"wchar_t", "continue", "for", "public", "throw", "while",
		"default", "friend", "register", "true", "delete", "goto",
		"reinterpret_cast", "try", "_Bool", "_Complex", "_Imaginary",
	];

	//合法的变量名正则表达式
	var nameRegex = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

	var GO;
	var diagram;
	var container;
	var configs;
	var specNodes;

	//交互模式，默认放置模式
	var interactiveMode = "place";

	var selectedPort;
	var selectedLink;

	var componentCounts;
	var follower;

	function init() {
		GO = go.GraphObject.make;
		diagram = GO(go.Diagram, "hardware-container", {
			initialContentAlignment: go.Spot.Center,
			allowClipboard: false,
			allowCopy: false,
			// allowSelect: false,
			allowTextEdit: false,
			allowReshape: false,
			allowRelink: false,
			allowLink: false,
			maxSelectionCount: 1,

			//可以撤消(Ctrl + Z)和重做(Ctrl + Y)
			// "undoManager.isEnabled": true,

			"toolManager.hoverDelay": 500,

			//放置模式时，单击放置
			"clickCreatingTool.isDoubleClick": false,
			
			//显示网格
			"grid.visible": true,

			//鼠标滑轮缩放
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
			//禁止拖动选择
			"dragSelectingTool.isEnabled": false,
			//禁止动画
			"animationManager.isEnabled": false,

			"click": onBackgroundSingleClick,
			"doubleClick": onBackgroundDoubleClick,
			"PartCreated": onPartCreated,
		});

		diagram.grid = GO(go.Panel, "Grid",
			// { gridCellSize: new go.Size(10, 30) },
			GO(go.Shape, "LineH", { stroke: "#EBEFF7" }),
			GO(go.Shape, "LineV", { stroke: "#EBEFF7" }),
			GO(go.Shape, "LineH", { stroke: "#F0F3F8", interval: 5 }),
			GO(go.Shape, "LineV", { stroke: "#F0F3F8", interval: 5 })
		);
		
		//节点模版
		for (var name in template.node) {
			var nodeTemplate = template.node[name];
			diagram.nodeTemplateMap.add(name == "default" ? "" : name, nodeTemplate)
		}

		//连线模版
		diagram.linkTemplate = template.link;
		diagram.nodeSelectionAdornmentTemplate = template.nodeSelection;
		diagram.linkSelectionAdornmentTemplate = template.linkSelection;

		var model = GO(go.GraphLinksModel, {
			linkFromPortIdProperty: "fromPort",
			linkToPortIdProperty: "toPort",
		});
		diagram.model = model;

		//重写
		var tool = diagram.toolManager.clickCreatingTool;
		tool.insertPart = function(loc) {
			this.archetypeNodeData = genNodeData(this.archetypeNodeData.name);
			return go.ClickCreatingTool.prototype.insertPart.call(this, loc);
		}

		specNodes = {};
		componentCounts = {};

		initEvent();
	}

	function load(_configs) {
		configs = _configs;
	}

	function initEvent() {
		$('.hardware .tools li').on('click', onToolsClick);
		follower = $('.hardware .follow .follower');
		
		EventManager.bind('hardware', 'nodeClick', onNodeClick);
		EventManager.bind('hardware', 'linkClick', onLinkClick);
		EventManager.bind('hardware', 'portClick', onPortClick);
	}

	function onToolsClick(e) {
		var li = $(this);
		if (util.toggleActive(li)) {
			var node = li;
			var action = node.data('action');
			switch (action) {
				case 'changeMode':
					onInteractiveModeClick(node, e);
					break;
			}
		}
	}

	function checkComponentFollow() {
		var container = $('#hardware-container').off('mousemove', onContainerMouseMove);
		follower.css({
			left: -999,
		});

		if(interactiveMode != "place") {
			return;
		}

		if($('.component .items .list > li.active').length == 0) {
			return;
		}

		container.on('mousemove', onContainerMouseMove);
	}

	function onContainerMouseMove(e) {
		follower.css({
			top: e.offsetY - follower.height() / 2,
			left: e.offsetX  - follower.width() / 2,
		});
	}

	function onInteractiveModeClick(node, e) {
		var mode = node.data('mode');
		setInteractiveMode(mode);
		if(mode == "place") {
			$('.component .items .list > li.active').click();
		}
	}

	//添加初始节点
	function addInitNodes() {
		var boardData = addNode("ArduinoUNO", 0, 0, true);
		specNodes["board"] = diagram.findNodeForData(boardData);
	}

	//添加节点
	function addNode(name, x, y, isBoard) {
		var nodeData = genNodeData(name, isBoard);
		if(typeof(x) == "number" && typeof(y) == "number") {
			nodeData.location = x + " " + y;
		}
		var model = diagram.model;
		model.addNodeData(nodeData);

		return nodeData;
	}

	function addLink(fromKey, toKey, fromPort, toPort) {
		var linkData = {
			from: fromKey,
			to: toKey,
			fromPort: fromPort,
			toPort: toPort,
		};
		var model = diagram.model;
		model.addLinkData(linkData);
		return linkData;
	}

	//查找特殊节点
	function findSpecNode(name) {
		return specNodes[name];
	}

	//暗示可以连接的port
	function hintTargetPort(sourcePort) {
		var board = findSpecNode("board");
		if(!board) {
			return;
		}
		var iter = board.ports.iterator;
		var port;
		while(iter.next()) {
			port = iter.value;
			port.opacity = 1;
		}
		if(selectedPort && selectedPort.diagram) {
			selectedPort.fill = "#F1C933";
		}

		selectedPort = sourcePort;
		if(selectedPort) {
			selectedPort.fill = "#F19833";
			var selectedType = selectedPort.part.data.type;
			if(selectedType == "component") {
				iter.reset();
				while(iter.next()) {
					port = iter.value;
					if(!portHasLink(port) && portTypeMatch(selectedPort, port)) {
						port.opacity = 0.6;
					}
				}
			}
		}
	}

	//高亮当前连线
	function highlightLink(link) {
		if(selectedLink && selectedLink.diagram) {
			selectedLink.fromPort.fill = "#F1C933";
			selectedLink.toPort.fill = "#F1C933";
		}
		
		selectedLink = link;
		if(selectedLink) {
			selectedLink.fromPort.fill = "#F19833";
			selectedLink.toPort.fill = "#F19833";
		}
	}

	function showNameDialog(args) {
		var dialog = $('.hardware .name-dialog');
		if(args) {
			var name = $('.name', dialog).val(args.varName).off('blur').on('blur', function(e) {
				var result = setVarName(args.key, name.val());
				if(!result.success) {
					name.val(args.varName);
					util.message(result.message);
				}
			});

			if(dialog.css("display") == "block") {
				var result = setVarName(args.key, name.val());
				if(!result.success) {
					name.val(args.varName);
					util.message(result.message);
				}
			}
			dialog.show();
			name.focus();
		} else {
			dialog.hide();
		}
	}

	function getConfig(name, isBoard) {
		return isBoard ? configs.boards[name]: configs.components[name];
	}

	function genNodeData(name, isBoard) {
		var config = getConfig(name, isBoard);
		var nodeData = $.extend(true, {}, config);
		var timeStamp = new Date().getTime();
		nodeData.key = name + "_" + timeStamp;
		var index = componentCounts[name] || 0;
		nodeData.varName += index;
		index++;
		componentCounts[name] = index;

		return nodeData;
	}

	function getPortData(port) {
		var part = port.part;
		var ports = part.data.ports;
		return ports[port.portId];
	}

	function getPortLink(port) {
		var part = port.part;
		var iter = part.findLinksConnected(port.portId).iterator;
		iter.next();
		return iter.value;
	}

	function portTypeMatch(port1, port2) {
		var portData1 = getPortData(port1);
		var portData2 = getPortData(port2);
		return portData1.type == portData2.type;
	}

	function portHasLink(port) {
		var part = port.part;
		return part.findLinksConnected(port.portId).count > 0;
	}

	//设置放置组件
	function setPlaceComponent(name) {
		var tool = diagram.toolManager.clickCreatingTool;
		if(!tool.isEnabled) {
			return false;
		}
		
		tool.archetypeNodeData = {name: name};

		var config = getConfig(name);
		follower.attr('src', config.source).css({
			width: config.width,
			height: config.height,
			left: -999,
		});

		return true;
	}

	function onBackgroundSingleClick(e) {
		hintTargetPort();
		highlightLink();
		showNameDialog(false);
	}

	function onBackgroundDoubleClick(e) {
		EventManager.trigger("project", "switchPanel", 1);
	}

	function onPartCreated(e) {
		changeInteractiveMode("default");
	}

	function changeInteractiveMode(mode) {
		$('.hardware .tools li[data-mode="' + mode + '"').click();
		checkComponentFollow();
	}

	function onNodeClick(node) {
		hintTargetPort();
		highlightLink();
		if(interactiveMode == "default") {
			var nodeData = node.data;
			var type = nodeData.type;
			if(type == "component") {
				showNameDialog({
					varName: nodeData.varName,
					key: nodeData.key,
				});
			} else {
				showNameDialog(false);
			}
		} else if(interactiveMode == "delete") {
			showNameDialog(false);
			if(node.deletable) {
				diagram.remove(node);
			}
		} else {
			showNameDialog(false);
		}
	}

	function onLinkClick(link) {
		hintTargetPort();
		showNameDialog(false);
		if(interactiveMode == "delete") {
			if(link == selectedLink) {
				highlightLink();
				selectedLink = null;
			}
			diagram.remove(link);
		} else if(interactiveMode == "default" || interactiveMode == "place") {
			highlightLink(link);
		}
	}

	function onPortClick(port) {
		highlightLink();
		showNameDialog(false);
		if(interactiveMode == "default") {
			var part = port.part;
			var nodeType = part.data.type;
			if(!selectedPort) {
				hintTargetPort(port);
			} else {
				var selectedType = selectedPort.part.data.type;
				if(selectedType == "component") {
					if(nodeType == "component") {
						if(!portHasLink(selectedPort) || portHasLink(port)) {
							//第一个端口没连线或者第二个端口已有连线
							hintTargetPort();
							return;	
						}
						var link = getPortLink(selectedPort);
						var linkOtherPort = link.getOtherPort(selectedPort);
						if(!portTypeMatch(port, linkOtherPort)) {
							//端口类型不匹配
							hintTargetPort();
							return;
						}
						//用第二个port重连
						diagram.remove(link);
						var fromKey = linkOtherPort.part.data.key;
						var toKey = port.part.data.key;
						addLink(fromKey, toKey, linkOtherPort.portId, port.portId);

						hintTargetPort();
					} else {
						if(portHasLink(selectedPort) || portHasLink(port) || !portTypeMatch(selectedPort, port)) {
							//要连接的端口已经有连线或者端口类型不匹配
							hintTargetPort();
							return;
						}
						//连线
						var fromKey = selectedPort.part.data.key;
						var toKey = port.part.data.key;
						addLink(fromKey, toKey, selectedPort.portId, port.portId);

						hintTargetPort();
					}
				} else {
					if(nodeType == "component") {
						if(portHasLink(selectedPort) || portHasLink(port) || !portTypeMatch(selectedPort, port)) {
							//要连接的端口已经有连线或者端口类型不匹配
							hintTargetPort();
							return;
						}
						//连线
						var fromKey = selectedPort.part.data.key;
						var toKey = port.part.data.key;
						addLink(fromKey, toKey, selectedPort.portId, port.portId);

						hintTargetPort();
					} else {
						if(!portHasLink(selectedPort) || portHasLink(port)) {
							//第一个端口没连线或者第二个端口已有连线
							hintTargetPort();
							return;	
						}
						var link = getPortLink(selectedPort);
						var linkOtherPort = link.getOtherPort(selectedPort);
						if(!portTypeMatch(port, linkOtherPort)) {
							//端口类型不匹配
							hintTargetPort();
							return;
						}
						//用第二个port重连
						diagram.remove(link);
						var fromKey = linkOtherPort.part.data.key;
						var toKey = port.part.data.key;
						addLink(fromKey, toKey, linkOtherPort.portId, port.portId);

						hintTargetPort();
					}
				}
			}
		} else {
			hintTargetPort();
		}
	}

	function setVarName(nodeKey, name) {
		if(name == "") {
			return {
				message: "变量名不能为空",
				success: false
			};
		}

		if(keywords.indexOf(name) >= 0) {
			return {
				message: "变量名不能是关键字",
				success: false
			};
		}

		if(!nameRegex.test(name)) {
			return {
				message: "变量名只能由字母、数字或下划线组成，且不能以数字开头",
				success: false
			};
		}

		var nodeDataArray = diagram.model.nodeDataArray;
		for(var i = 0; i < nodeDataArray.length; i++) {
			var nodeData = nodeDataArray[i];
			if(nodeData.key != nodeKey && nodeData.name == name) {
				return {
					message: "变量名重复",
					success: false
				};
			}
		}

		var nodeData = diagram.model.findNodeDataForKey(nodeKey);
		if(!nodeData) {
			return {
				message: "非法操作",
				success: true
			};
		}

		nodeData.varName = name;
		return {
			success: true
		};
	}

	function setInteractiveMode(mode) {
		interactiveMode = mode;
		switch(interactiveMode) {
			//放置模式
			case "place":
				diagram.toolManager.clickCreatingTool.isEnabled = true;
				break;
			//删除模式
			case "delete":
				diagram.toolManager.clickCreatingTool.isEnabled = false;
				break;
			//默认模式
			case "default":
			default:
				diagram.toolManager.clickCreatingTool.isEnabled = false;
				break;
		}
		if(interactiveMode != "place") {
			checkComponentFollow();
		}
	}

	function getNodes() {
		var nodes = [];

		var board = findSpecNode("board");
		var iter = board.findNodesConnected().iterator;
		var node;
		var nodeData;
		var ports;
		var link;
		var iter2;
		var nodeType;
		while(iter.next()) {
			node = iter.value;
			nodeData = node.data;
			ports = [];
			iter2 = board.findLinksBetween(node).iterator;
			while(iter2.next()) {
				link = iter2.value;
				nodeType = link.fromPort.part.data.type;
				if(nodeType == "board") {
					ports.push({
						source: link.toPort.portId,
						target: link.fromPort.portId,
					});
				} else {
					ports.push({
						source: link.fromPort.portId,
						target: link.toPort.portId,
					});
				}
			}
			nodes.push({
				name: nodeData.name,
				headCode: nodeData.headCode,
				varCode: nodeData.varCode,
				setupCode: nodeData.setupCode,
				varName: nodeData.varName,
				ports: ports,
			});
		}

		return nodes.sort(function(a, b){
			var nameResult = a.name.localeCompare(b.name);
			if(nameResult == 0) {
				return a.varName.localeCompare(b.varName);
			}
			return nameResult;
		});
	}

	function getModel() {
		if(diagram && diagram.model) {
			return diagram.model.toJson();
		}
		return "";
	}

	function setModel(model) {
		diagram.model.clear();
		if(model) {
			diagram.model = go.Model.fromJson(model);
		} else {
			addInitNodes();
		}
	}

	return {
		init: init,
		load: load,
		getModel: getModel,
		setModel: setModel,
		setPlaceComponent: setPlaceComponent,
		changeInteractiveMode: changeInteractiveMode,
		getNodes: getNodes,
	}
});