define(['jquery', 'goJS', 'nodeTemplate', 'EventManager'], function($, _, template, EventManager) {
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

	function init(containerId, _configs) {
		configs = _configs,
		GO = go.GraphObject.make;
		diagram = GO(go.Diagram, containerId, {
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
			"grid.gridCellSize": new go.Size(40, 40),
			"draggingTool.isGridSnapEnabled": true,
			"resizingTool.isGridSnapEnabled": true,

			//鼠标滑轮缩放
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
			//禁止拖动选择
			"dragSelectingTool.isEnabled": false,
			//禁止动画
			"animationManager.isEnabled": false,

			"click": onBackgroundSingleClick,
			"PartCreated": onPartCreated,
		});
		
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

		EventManager.bind('hardware', 'nodeClick', onNodeClick);
		EventManager.bind('hardware', 'linkClick', onLinkClick);
		EventManager.bind('hardware', 'portClick', onPortClick);

		//添加初始节点
		addInitNodes();
	}

	//添加初始节点
	function addInitNodes() {
		var boardData = addNode("ArduinoUNO", null, null, true);
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
			iter.reset();
			while(iter.next()) {
				port = iter.value;
				if(!portHasLink(port) && portTypeMatch(selectedPort, port)) {
					port.opacity = 0.6;
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
		EventManager.trigger("hardware", "showNameDialog", args);
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

		return true;
	}

	function onBackgroundSingleClick(e) {
		hintTargetPort();
		highlightLink();
		showNameDialog(false);
	}

	function onPartCreated(e) {
		EventManager.trigger("hardware", "changeInteractiveMode", "default");
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
				if(nodeType != "component") {
					//第一个必须是组件
					return;
				}
				hintTargetPort(port);
			} else {
				if(nodeType == "component") {
					if(portHasLink(port)) {
						//另一个端口已经有连线
						hintTargetPort();
						return;
					}

					if(portHasLink(selectedPort)) {
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
						hintTargetPort(port);
					}
				} else {
					if(portHasLink(port) || !portTypeMatch(selectedPort, port)) {
						//要连接的端口已经有连线或者端口类型不匹配
						hintTargetPort();
						return;
					}
					if(portHasLink(selectedPort)) {
						//先删除已有连线
						var link = getPortLink(selectedPort);
						diagram.remove(link);
					}

					//连线
					var fromKey = selectedPort.part.data.key;
					var toKey = port.part.data.key;
					addLink(fromKey, toKey, selectedPort.portId, port.portId);

					hintTargetPort();
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
		console.dir(nodes);

		return nodes.sort(function(a, b){
			var nameResult = a.name.localeCompare(b.name);
			if(nameResult == 0) {
				return a.varName.localeCompare(b.varName);
			}
			return nameResult;
		});
	}

	return {
		init: init,
		setPlaceComponent: setPlaceComponent,
		setInteractiveMode: setInteractiveMode,
		setVarName: setVarName,
		getNodes: getNodes,
	}
});