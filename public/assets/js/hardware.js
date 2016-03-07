define(['jquery', 'jquery-ui', 'goJS', 'nodeTemplate', 'EventManager', 'util'], function($, _, _, template, EventManager, util) {
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
	var configs;

	var container;
	var containerId = "hardware-container";
	var follower;

	//交互模式
	var interactiveMode = "drag";
	//模式
	var mode = "default";

	var selectedPort;
	var selectedLink;

	var componentCounts;

	function init() {
		GO = go.GraphObject.make;
		diagram = GO(go.Diagram, containerId, {
			initialContentAlignment: go.Spot.Center,
			allowClipboard: false,
			allowCopy: false,
			allowTextEdit: false,
			allowReshape: false,
			allowRelink: false,
			allowLink: true,
			maxSelectionCount: 1,

			"toolManager.hoverDelay": 500,

			//克模式时，单击放置
			"clickCreatingTool.isEnabled": false,
			"clickCreatingTool.isDoubleClick": false,

			//拖拽
			"linkingTool.portGravity": 50,
			"linkingTool.linkValidation": linkValidation,
			"relinkingTool.linkValidation": linkValidation,
			
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
			"contextClick": onBackgroundContextClick,
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

		diagram.toolManager.linkingTool.temporaryLink =
			GO(go.Link, GO(go.Shape, 
				{stroke: "#95a3ad", strokeWidth: 2})
			);

		var tempfromnode =
			GO(go.Node, GO(go.Shape, 
				{stroke: null, fill: null, portId: "", width: 0, height: 0 })
			);
		diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
		diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

		var temptonode = 
			GO(go.Node, GO(go.Shape, 
				{stroke: null, fill: null, portId: "", width: 0, height: 0 })
			);
		diagram.toolManager.linkingTool.temporaryToNode = temptonode;
		diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

		//重写
		var tool = diagram.toolManager.clickCreatingTool;
		tool.insertPart = function(loc) {
			this.archetypeNodeData = genNodeData(this.archetypeNodeData.name);
			return go.ClickCreatingTool.prototype.insertPart.call(this, loc);
		}

		tool = diagram.toolManager.linkingTool;
		tool.doActivate = function() {
			var port = this.findLinkablePort();
			hintTargetPort(port);
			return go.LinkingTool.prototype.doActivate.call(this);
		}

		tool.doDeactivate = function() {
			var result = go.LinkingTool.prototype.doDeactivate.call(this);
			hintTargetPort();
			return result;
		}

		var model = GO(go.GraphLinksModel, {
			linkFromPortIdProperty: "fromPort",
			linkToPortIdProperty: "toPort",
		});
		diagram.model = model;

		componentCounts = {};

		initEvent();
		setInteractiveMode(interactiveMode);
	}

	function load(_configs) {
		configs = _configs;
	}

	function getData() {
		return {
			model: diagram.model.toJson(),
			componentConuts: componentConuts,
		};
	}

	function setData(data) {
		data = data || {};
		if(data.model) {
			diagram.model = go.Model.fromJson(data.model);
		} else {
			diagram.clear();
			addInitNodes();
		}
		componentConuts = data.componentConuts || [];

		hintTargetPort();
		highlightLink();
		showNameDialog(false);
	}

	function getInteractiveMode() {
		return interactiveMode;
	}

	//设置放置组件
	function setPlaceComponent(name) {
		if(interactiveMode != "modern") {
			return;
		}

		var tool = diagram.toolManager.clickCreatingTool;
		tool.isEnabled = true;
		tool.archetypeNodeData = {name: name};	

		var config = getConfig(name);
		follower.attr('src', config.source).css({
			width: config.width,
			height: config.height,
			left: -999,
		});

		setComponentFollow()
	}

	function getNodes() {
		var nodes = [];

		var board = findBoard();
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

	function initEvent() {
		container = $('#' + containerId).droppable({
			disabled: true,
			scope: "hardware",
			drop: onContainerDrop,
		});
		follower = $('.hardware .follow .follower');

		$('.hardware .tools .interactive-mode > li').on('click', onInteractiveModeClick);
		$('.hardware .tools .mode > li').on('click', onModeClick);
		
		EventManager.bind('hardware', 'nodeClick', onNodeClick);
		EventManager.bind('hardware', 'linkClick', onLinkClick);
		EventManager.bind('hardware', 'portClick', onPortClick);
	}

	function setMode(mode) {
		$('.hardware .tools .mode li[data-mode="' + mode + '"').click();
	}

	function setInteractiveMode(mode) {
		if(mode == "drag") {
			$('.hardware .tools .interactive-mode li[data-mode="modern"]').click();
		} else {
			$('.hardware .tools .interactive-mode li[data-mode="drag"]').click();
		}
	}

	function setComponentFollow(value) {
		container.off('mousemove', onContainerMouseMove);
		follower.css({
			left: -999,
		});

		if(interactiveMode != "modern" || (mode != "default" && mode != "clone")) {
			return;
		}

		if(value === undefined && !diagram.toolManager.clickCreatingTool.isEnabled) {
			return;
		} else if(value == false) {
			diagram.toolManager.clickCreatingTool.isEnabled = false;
			return;
		}

		container.on('mousemove', onContainerMouseMove);
		container.off('mouseout').on('mouseout',  onContainerMouseOut);
	}

	function onContainerMouseMove(e) {
		follower.css({
			top: e.offsetY - follower.height() / 2,
			left: e.offsetX  - follower.width() / 2,
		});
	}

	function onContainerMouseOut(e) {
		follower.css({
			left: -999,
		});
	}

	function onModeClick(e) {
		var li = $(this);
		util.toggleActive(li);
		mode = li.data('mode');
		var tool = diagram.toolManager.clickCreatingTool;
		var value = interactiveMode == "modern";
		switch(mode) {
			//默认模式
			case "default":
				tool.isEnabled = value;
				break;
			//克隆模式
			case "clone":
				tool.isEnabled = value;
				break;
			//删除模式
			case "delete":
				tool.isEnabled = false;
				break;
		}

		setComponentFollow();
	}

	function onInteractiveModeClick(node, e) {
		var li = $(this).addClass("hide");
		var mode = li.data('mode');
		var clone = $('.hardware .tools .mode li[data-mode="clone"]');
		if(mode == "drag") {
			interactiveMode = "modern";
			li.parent().find('li[data-mode="' + interactiveMode + '"]').removeClass("hide");
			clone.removeClass("hide");
		} else {
			interactiveMode = "drag";
			li.parent().find('li[data-mode="' + interactiveMode + '"]').removeClass("hide");
			clone.addClass("hide");
		}
		container.droppable("option", "disabled", interactiveMode != "drag");
		setMode("default");

		EventManager.trigger("hardware", "changeInteractiveMode", interactiveMode);
	}

	//添加初始节点
	function addInitNodes() {
		addNode("ArduinoUNO", 0, 0, true);
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

	function findBoard() {
		var iter = diagram.nodes.iterator;
		var node;
		while(iter.next()) {
			node = iter.value;
			if(node.data.type == "board") {
				return node;
			}
		}
	}

	//暗示可以连接的port
	function hintTargetPort(sourcePort) {
		var board = findBoard();
		if(!board) {
			return;
		}
		var iter = board.ports.iterator;
		var port;
		while(iter.next()) {
			port = iter.value;
			if(portHasLink(port)) {
				port.fill = "#4891ed";
			} else {
				port.fill ="#ffe42b";
			}
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
					if(portHasLink(port) || !portTypeMatch(selectedPort, port)) {
						port.fill = "#4891ed";
					}
				}
			}
		}
	}

	//高亮当前连线
	function highlightLink(link) {
		if(selectedLink && selectedLink.diagram) {
			selectedLink.fromPort.fill = "#F1C933";
			selectedLink.toPort.fill = "#4891ed";
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

	function onBackgroundSingleClick(e) {
		hintTargetPort();
		highlightLink();
		showNameDialog(false);
	}

	function onBackgroundDoubleClick(e) {
		EventManager.trigger("project", "switchPanel", 1);
	}

	function onBackgroundContextClick(e) {
		setMode("default");
		setComponentFollow(false);
	}

	function onPartCreated(e) {
		if(mode == "default") {
			diagram.toolManager.clickCreatingTool.isEnabled = false;
		}
		setComponentFollow();
	}

	function onNodeClick(node) {
		hintTargetPort();
		highlightLink();
		if(mode == "default") {
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
		} else if(mode == "delete") {
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
		if(mode == "delete") {
			if(link == selectedLink) {
				highlightLink();
				selectedLink = null;
			}
			diagram.remove(link);
		} else if(mode == "default" || mode == "clone") {
			highlightLink(link);
		}
	}

	function onPortClick(port) {
		highlightLink();
		showNameDialog(false);
		if(interactiveMode == "modern" && mode == "default") {
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

	function linkValidation(fromNode, fromPort, toNode, toPort) {
		return !portHasLink(fromPort) && !portHasLink(toPort) && portTypeMatch(fromPort, toPort);
	}

	function onContainerDrop(e, ui) {
		var element = ui.helper.first();
		var name = element.data('component-name');
		var width = element.width();
		var height = element.height();
		var centerX = element.offset().left + width / 2;
		var centerY = element.offset().top + height / 2;

		var config = getConfig(name);
		switch(config.category) {
			case "one-port-top":
			case "two-port-top": 
				centerY -= 3.5;
				break;
			case "one-port-bottom": 
			case "two-port-bottom":
				centerY += 3.5;
				break;
			case "one-port-right": 
				centerX += 3.5;
				break;
		}

		var offset = $(diagram.div).offset();
		var point = new go.Point(centerX - offset.left, centerY - offset.top);
		point = diagram.transformViewToDoc(point);

		addNode(name, point.x, point.y);
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

	return {
		init: init,
		load: load,
		getData: getData,
		setData: setData,
		getInteractiveMode: getInteractiveMode,
		setPlaceComponent: setPlaceComponent,
		getNodes: getNodes,
	}
});