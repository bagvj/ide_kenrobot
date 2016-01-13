define(['jquery', 'jquery-ui', 'goJS', "hardware", "code", "EventManager", "util"], function($, _, _, hardware, code, EventManager, util) {
	var GO;
	var diagram;
	var container;
	var configs;
	var defaultOffsetX = 80;
	var defaultOffsetY = 70;

	//记录特殊节点，如start、loopStart、loopEnd、end
	var specNodes = {};
	//记录特殊连线，如start -> loopStart、loopEnd -> end、loopEnd -> loopStart
	var specLinks = {};

	function init(containerId, template, _configs) {
		configs = _configs;
		GO = go.GraphObject.make;
		diagram = GO(go.Diagram, containerId, {
			initialContentAlignment: go.Spot.Center,
			allowClipboard: false,
			allowCopy: false,
			// allowSelect: false,
			allowTextEdit: false,
			allowReshape: false,
			// allowRelink: false,
			allowLink: false,
			maxSelectionCount: 1,

			//可以撤消(Ctrl + Z)和重做(Ctrl + Y)
			// "undoManager.isEnabled": true,

			//显示网格
			// "grid.visible": true,
			// "grid.gridCellSize": new go.Size(20, 20),

			//鼠标滑轮缩放
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
			"toolManager.hoverDelay": 100,
			//禁止拖动选择
			"dragSelectingTool.isEnabled": false,
			//禁止动画
			"animationManager.isEnabled": false,

			SelectionDeleting: onSelectionDeleting,
			SelectionDeleted: onSelectionDeleted,
		});

		//节点模版
		for (var name in template.node) {
			var nodeTemplate = template.node[name];
			diagram.nodeTemplateMap.add(name == "default" ? "" : name, nodeTemplate)
		}

		//连线模版
		diagram.linkTemplate = template.link;
		diagram.nodeSelectionAdornmentTemplate = template.selection;

		var model = GO(go.GraphLinksModel, {
			name: "software",
			linkFromPortIdProperty: "fromPort",
			linkToPortIdProperty: "toPort",
		});
		diagram.model = model;

		//拖拽
		container = $("#" + containerId);
		liveHardwareDrag();

		container.droppable({
			scope: "software",
			over: onCanvasDropOver,
			out: onCanvasDropOut,
			drop: onCanvasDrop,
		});

		//添加初始节点
		addInitNodes();

		EventManager.bind("hardware", "addNode", onHardwareAddNode);
		EventManager.bind("hardware", "deleteNode", onHardwareDeleteNode);
		EventManager.bind("software", "editNode", onEditNode);
	}

	//查找if-else合并的节点
	function findIfMergeNode(node) {
		var preNode = node;
		var toNode = findTargetNode(preNode, "L");
		var iter;
		var link;
		var toNodeData;
		var isFind = false;
		do {
			toNodeData = toNode.data;
			if(toNodeData.tag == 2) {
				if(toNodeData.subTag == 1) {
					iter = toNode.findLinksInto("T").iterator;
					if(iter.count >= 2) {
						isFind = true;
					} else {
						preNode = toNode;
						toNode = findIfMergeNode(toNode);
					}
				} else {
					link = findTargetLink(preNode, toNode);
					if(link.toPort.portId == "T") {
						iter = toNode.findLinksInto("T").iterator;
						if(iter.count >= 2) {
							isFind = true;
						} else {
							preNode = toNode;
							toNode = findTargetNode(toNode, "R");
						}
					} else {
						isFind = true;
					}
				}
			} else {
				iter = toNode.findLinksInto("T").iterator;
				if(iter.count >= 2) {
					isFind = true;
				} else {
					preNode = toNode;
					toNode = findTargetNode(toNode, "B");
				}
			}
		} while(!isFind);

		return toNode;
	}

	//查找目标节点
	function findTargetNode(node, port) {
		var nodes = node.findNodesOutOf(port);
		var nodesIter = nodes.iterator;
		if(nodesIter.count > 0) {
			nodesIter.next();
			return nodesIter.value;
		}
		return null;
	}

	function findTargetLink(node, otherNode, portId) {
		var links = node.findLinksTo(otherNode, portId);
		var linksIter = links.iterator;
		if(linksIter.count > 0) {
			linksIter.next();
			return linksIter.value;
		}
		return null;
	}

	//查找特殊节点
	function findSpecNode(name) {
		return specNodes[name];
	}

	function makeImage(options) {
		return diagram.makeImage(options);
	}

	function test() {

	}

	function liveHardwareDrag() {
		$(".nav-second ul li ul li", container.parent()).draggable({
			appendTo: "body",
			scope: "software",
			revert: true,
			revertDuration: 0,
			zIndex: 9999,
			containment: "window",
			cursorAt: {
				top: 8,
				left: 15
			},
			helper: onCreateDrag,
			start: onDragStart,
			stop: onDragStop,
		});
	}

	function onCreateDrag(e) {
		return $("img", this).clone().removeClass("software-item");
	}

	function onDragStart(e, ui) {
		var element = ui.helper.first();
		var key = element.attr("data-key");
		var hardwareNodeData = hardware.getNodeData(key);
		if(hardwareNodeData && hardwareNodeData.is_controller) {
			return false;
		}
		var loopEndToLoopStartLink = specLinks["loopEnd_loopStart"];
		var loopEndToEndLink = specLinks["loopEnd_end"];
		diagram.links.each(function(link) {
			if (link != loopEndToLoopStartLink && link != loopEndToEndLink) {
				link.findObject("LINE").stroke = "blue";
				link.findObject("ARROW").fill = "blue";
			}
		});
	}

	function onDragStop(e, ui) {
		var loopEndToEndLink = specLinks["loopEnd_end"];
		var loopEndToLoopStartLink = specLinks["loopEnd_loopStart"];
		diagram.links.each(function(link) {
			if (link != loopEndToEndLink && link != loopEndToLoopStartLink) {
				link.findObject("LINE").stroke = "gray";
				link.findObject("ARROW").fill = "gray";
			}
		});
	}

	//监听window鼠标移动事件
	function onMouseMoveWhenDrag(e) {

	}

	//拖拽进入时，开始监听window鼠标移动事件
	function onCanvasDropOver(e) {
		// $(window).on("mousemove", onMouseMoveWhenDrag);
	}

	//拖拽移出时，取消监听window鼠标移动事件
	function onCanvasDropOut(e) {
		// $(window).off("mousemove", onMouseMoveWhenDrag);
	}

	function predicateLink(obj) {
		return (obj instanceof go.Link) && obj != specLinks["loopEnd_loopStart"] && obj != specLinks["loopEnd_end"];
	}

	function onCanvasDrop(e, ui) {
		var element = ui.helper.first();
		var offset = $(diagram.div).offset();
		var width = element.width();
		var height = element.height();
		var point = new go.Point(e.pageX - offset.left, e.pageY - offset.top);
		point = diagram.transformViewToDoc(point);
		var rect = new go.Rect(point.x - width / 2, point.y - height / 2, width, height);
		//在给定矩形内查找连线
		var links = new go.List(go.Link);
		links.addAll(diagram.findObjectsIn(rect, null, predicateLink, true));
		if (links.count == 0) {
			return;
		}

		var relinks = new go.List(go.Link);
		relinks.add(links.get(0));

		if (links.count == 2) {
			var first = links.get(0);
			var second = links.get(1);
			if (first.toNode == second.toNode) {
				relinks.add(second);
			}
		}

		var name = element.attr("data-name");
		var key = element.attr("data-key");
		var hardwareNodeData;
		if (key) {
			hardwareNodeData = hardware.getNodeData(key);
		}
		// var nodeConfig = getConfig(name);
		var model = diagram.model;

		model.startTransaction("addNode");
		var nodeData = addNode(name, point.x, point.y);
		if(!nodeData) {
			return;
		}
		if (key) {
			nodeData.hardwareKey = key;
			var params = nodeData.init_params;
			for(var i = 0; i < params.length; i++) {
				var param = params[i];
				if(param.auto_set) {
					if(param.name == "port") {
						param.default_value = hardwareNodeData.portIndex;
					} else if(param.name == "bit") {
						param.default_value = hardwareNodeData.bitIndex;
					} else if(param.name == "index") {
						param.default_value = hardwareNodeData.index;
					}
				}
			}
			params = nodeData.params;
			for(i = 0; i < params.length; i++) {
				var param = params[i];
				if(param.auto_set) {
					if(param.name == "port") {
						param.default_value = hardwareNodeData.portIndex;
					} else if(param.name == "bit") {
						param.default_value = hardwareNodeData.bitIndex;
					} else if(param.name == "index") {
						param.default_value = hardwareNodeData.index;
					}
				}
			}
		}
		nodeData.code = code.getFormatExp(nodeData);

		var nodeKey = nodeData.key;

		relinks.each(function(link) {
			var linkData = link.data;
			var fromKey = model.getFromKeyForLinkData(linkData);
			var toKey = model.getToKeyForLinkData(linkData);
			var fromPort = model.getFromPortIdForLinkData(linkData);
			var toPort = model.getToPortIdForLinkData(linkData);

			model.removeLinkData(linkData);
			addLink(fromKey, nodeKey, fromPort, "T");
			if (nodeData.tag == 2) {
				//控制节点(if-else、for、while)
				var subTag = nodeData.subTag;
				if (subTag == 1) {
					//if-else
					addLink(nodeKey, toKey, "L", toPort);
					addLink(nodeKey, toKey, "R", toPort);
				} else {
					//循环
					addLink(nodeKey, nodeKey, "B", "L");
					addLink(nodeKey, toKey, "R", toPort);
				}
			} else {
				addLink(nodeKey, toKey, "B", toPort, linkData.text);
			}
		});
		model.commitTransaction("addNode");

		autoConnect();
		EventManager.trigger("code", "refresh");

		if(name == "light") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[1, 4, pos.left, pos.top], [2, 4, pos.left, pos.top], [3, 7, pos.left, pos.top], [7, 7, pos.left, pos.top]]);
		} else if(name == "switch") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[3, 5, pos.left, pos.top]]);
		} else if(name == "dcMotor") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[4, 4, pos.left, pos.top]]);
		} else if(name == "digitalTube") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[5, 4, pos.left, pos.top], [6, 7, pos.left, pos.top]]);
		} else if(name == "temperatue") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[6, 5, pos.left, pos.top]]);
		} else if(name == "illumination") {
			var pos = getStepPos(nodeData, offset);
			EventManager.trigger("demo", "finishStep", [[7, 5, pos.left, pos.top]]);
		}
	}

	function getStepPos(nodeData, offset) {
		var point = go.Point.parse(nodeData.location);
		point = diagram.transformDocToView(point);
		point = {x: point.x + offset.left, y: point.y + offset.top};
		return {
			left: point.x + nodeData.width,
			top: point.y - 40,
		}
	}

	function onSelectionDeleting(e) {
		var node = e.subject.first();
		if (!node.deletable) {
			e.cancel = true;
			return;
		}

		var nodeData = node.data;
		var nodeTag = nodeData.tag;
		var toNode;
		if (nodeTag == 2) {
			var subTag = nodeData.subTag;
			if (subTag == 1) {
				//if-else
				var yesNode = findTargetNode(node, "L");
				var noNode = findTargetNode(node, "R");
				if (yesNode != noNode) {
					e.cancel = true;
					alert("请先删除分支");
					return;
				}
				toNode = findIfMergeNode(node);
			} else {
				//循环
				var bodyNode = findTargetNode(node, "B");
				if (bodyNode != node) {
					e.cancel = true;
					alert("请先删除循环体");
					return;
				}
				toNode = findTargetNode(node, "R");
			}
		} else {
			toNode = findTargetNode(node, "B");
		}
		var toNodeData = toNode.data;
		var toKey = toNodeData.key;
		var link = findTargetLink(node, toNode);
		var toPort = link.toPort.portId;
		var fromLinks = node.findLinksInto("T");
		var model = diagram.model;
		model.startTransaction("relink");
		fromLinks.each(function(fromLink){
			var linkData = fromLink.data;
			var fromKey = model.getFromKeyForLinkData(linkData);
			var fromPort = model.getFromPortIdForLinkData(linkData);
			addLink(fromKey, toKey, fromPort, toPort);
		});
		model.commitTransaction("relink");
	}

	function onSelectionDeleted(e) {
		autoConnect();
		EventManager.trigger("code", "refresh");
	}

	function onHardwareAddNode(args) {
		liveHardwareDrag();
	}

	function onHardwareDeleteNode(args) {
		var hardwareKey = args.key;

		var model = diagram.model;
		var nodes = model.nodeDataArray;
		for (var i = 0; i < nodes.length; i++) {
			var nodeData = nodes[i];
			if (nodeData.hardwareKey && nodeData.hardwareKey == hardwareKey) {
				var node = diagram.findNodeForData(nodeData);
				diagram.clearSelection();
				diagram.select(node);
				diagram.commandHandler.deleteSelection();
				break;
			}
		}
	}

	function onEditNode(args) {
		var e = args.e;
		var node = args.node;
		var nodeData = node.data;

		if (!nodeData.init_params && !nodeData.params) {
			//没有参数
			return;
		}

		var nodeName = nodeData.name;
		var contents = [];

		var init_params = nodeData.init_params;
		if (init_params) {
			for (var i = 0; i < init_params.length; i++) {
				var param = init_params[i];
				if (!param.auto_set) {
					contents.push({
						"title": param.label,
						"inputType": param.input_type,
						"inputHolder": (param.placeholder) ? param.placeholder : "",
						"inputInitValue": param.default_value,
						"inputKey": "init_" + param.name,
					});
				}
			}
		}

		var params = nodeData.params;
		if (params) {
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				if (!param.auto_set) {
					contents.push({
						"title": param.label,
						"inputType": param.input_type,
						"inputHolder": (param.placeholder) ? param.placeholder : "",
						"inputInitValue": param.default_value,
						"inputKey": param.name
					});
				}
			}
		}
		contents.push({
			"title": "注释",
			"inputType": "none",
			"fontColor": "#BBBDBF",
			"showText": nodeData.desc || "暂无"
		});

		util.show(0, {
			"title": "属性设置",
			"contents": contents
		}, function(data) {
			onEditNodeSave(nodeData, data);
		});
	}

	function onEditNodeSave(nodeData, data) {
		var params = nodeData.params;
		var init_params = nodeData.init_params;

		for (var name in data) {
			var value = data[name];
			var param;
			if (name.length > 5 && name.substr(0, 5) == "init_") {
				name = name.substr(5);
				param = findParam(init_params, name);
			} else {
				param = findParam(params, name);
			}
			param.default_value = value;
		}
		EventManager.trigger("code", "refresh");
		nodeData.code = code.getFormatExp(nodeData);

		if(nodeData.name == "light") {
			if(data.value == "1") {
				EventManager.trigger("demo", "finishStep", [[1, 5], [2, 5]]);
			} else if(data.value == "0") {
				EventManager.trigger("demo", "finishStep", [[2, 7]]);
			} else if(data.value == "Switch") {
				EventManager.trigger("demo", "finishStep", [[3, 8]]);
			} else if(data.value == "Light") {
				EventManager.trigger("demo", "finishStep", [[7, 8]]);
			}
		} else if(nodeData.name == "delay") {
			if(data.time == "1000") {
				EventManager.trigger("demo", "finishStep", [[2, 6], [2, 8]]);
			}
		} else if(nodeData.name == "switch") {
			if(data.value == "Switch") {
				EventManager.trigger("demo", "finishStep", [[3, 6]]);
			}
		} else if(nodeData.name == "dcMotor") {
			EventManager.trigger("demo", "finishStep", [[4, 5]]);
		} else if(nodeData.name == "digitalTube") {
			EventManager.trigger("demo", "finishStep", [[5, 5]]);
			if(data.num == "Tem") {
				EventManager.trigger("demo", "finishStep", [[6, 8]]);
			}
		} else if(nodeData.name == "temperatue") {
			if(data.value == "Tem") {
				EventManager.trigger("demo", "finishStep", [[6, 6]]);
			}
		} else if(nodeData.name == "illumination") {
			if(data.value == "Light") {
				EventManager.trigger("demo", "finishStep", [[7, 6]]);
			}
		}
	}

	function findParam(params, name) {
		for (var i = 0; i < params.length; i++) {
			var param = params[i];
			if (param.name == name) {
				return param;
			}
		}
	}

	//添加初始节点
	function addInitNodes() {
		var startData = addNode("start");
		startData.code = "void setup()";
		//hack，居中
		setNodePosition(startData, 0, -120);
		var loopStartData = addNode("loopStart", 0, -40);
		loopStartData.code = "void loop()";
		var loopEndData = addNode("loopEnd", 0, 40);
		var endData = addNode("end", 0, 120);
		var startToLoopStartLink = addLink(startData.key, loopStartData.key, "B", "T");
		var loopStartToLoopEndLink = addLink(loopStartData.key, loopEndData.key, "B", "T");
		var loopEndToLoopStartLink = addLink(loopEndData.key, loopStartData.key, "L", "L");
		var loopEndToEndLink = addLink(loopEndData.key, endData.key, "B", "T");

		//记录特殊节点
		specNodes["start"] = diagram.findNodeForData(startData);
		specNodes["loopStart"] = diagram.findNodeForData(loopStartData);
		specNodes["loopEnd"] = diagram.findNodeForData(loopEndData);
		specNodes["end"] = diagram.findNodeForData(endData);

		//记录特殊连线
		specLinks["start_loopStart"] = diagram.findLinkForData(startToLoopStartLink);
		specLinks["loopStart_loopEnd"] = diagram.findLinkForData(loopStartToLoopEndLink);
		specLinks["loopEnd_loopStart"] = diagram.findLinkForData(loopEndToLoopStartLink);
		specLinks["loopEnd_end"] = diagram.findLinkForData(loopEndToEndLink);
	}

	function findSpecNode(name) {
		var iter = diagram.nodes.iterator;
		var node;
		while(iter.next()) {
			node = iter.value;
			if(node.data.name == name) {
				break;
			}
		}
		return node;
	}

	function findSpecLink(name) {
		var iter = diagram.links.iterator;
		var link;
		while(iter.next()) {
			link = iter.value;
			if(link.data.name == name) {
				break;
			}
		}
		return link;
	}

	//添加节点
	function addNode(name, x, y) {
		var config = getConfig(name);
		if(!config) {
			console.log("unknow node " + name);
			return false;
		}

		var nodeData = $.extend(true, {}, config);
		var timeStamp = new Date().getTime();
		nodeData.key = name + "_" + timeStamp;
		if (typeof(x) == "number" && typeof(y) == "number") {
			nodeData.location = x + " " + y;
		}
		var model = diagram.model;
		// model.startTransaction("addNode");
		model.addNodeData(nodeData);
		// model.commitTransaction("addNode");

		return nodeData;
	}

	//设置节点位置
	function setNodePosition(nodeData, x, y) {
		diagram.model.setDataProperty(nodeData, "location", x + " " + y);
	}

	//添加连接
	function addLink(fromKey, toKey, fromPort, toPort) {
		var linkData = {
			from: fromKey,
			to: toKey,
			fromPort: fromPort,
			toPort: toPort,
		};
		var model = diagram.model;
		// model.startTransaction("addLink");
		model.addLinkData(linkData);
		var link = diagram.findLinkForData(linkData);
		var fromNode = link.fromNode;
		var fromNodeName = fromNode.data.name;
		if(fromNodeName == "ifElse") {
			diagram.model.setDataProperty(linkData, "text", fromPort == "L" ? "Yes" : "No");
		}
		// model.commitTransaction("addLink");
		return linkData;
	}

	//自动连线
	function autoConnect() {
		var startNode = findSpecNode("start");
		var endNode = findSpecNode("end");
		var link = specLinks["loopEnd_loopStart"];

		var point = go.Point.parse(startNode.data.location);
		var model = diagram.model;
		model.startTransaction("autoConnect");
		visitNode(startNode, endNode, {
			x: point.x,
			y: point.y
		});
		model.commitTransaction("autoConnect");
	}

	function visitNode(node, endNode, param) {
		while (node != endNode) {
			var nodeData = node.data;
			var nodeName = nodeData.name;

			setNodePosition(nodeData, param.x, param.y);
			// var nodeConfig = getConfig(nodeName);
			var nodeTag = nodeData.tag;
			if (nodeTag == 1) {
				var nextNode = findTargetNode(node, "B");
				node = nextNode;
				param.y += defaultOffsetY;
			} else if (nodeTag == 2) {
				var subTag = nodeData.subTag;
				if (subTag == 1) {
					var mergeNode = findIfMergeNode(node);
					var yesNode = findTargetNode(node, "L");
					var noNode = findTargetNode(node, "R");
					var ifOffsetY = 8;
					var yesParam = visitNode(yesNode, mergeNode, {
						x: param.x - defaultOffsetX,
						y: param.y + defaultOffsetY - ifOffsetY,
					});
					var noParam = visitNode(noNode, mergeNode, {
						x: param.x + defaultOffsetX,
						y: param.y + defaultOffsetY - ifOffsetY,
					});
					var mergeY = Math.max(yesParam.y, noParam.y);

					param.y = mergeY + ifOffsetY;
					node = mergeNode;
				} else if (subTag == 2) {
					var bodyNode = findTargetNode(node, "B");
					var nextNode = findTargetNode(node, "R");
					var bodyParam = visitNode(bodyNode, node, {
						x: param.x,
						y: param.y + defaultOffsetY
					});
					setNodePosition(nodeData, param.x, param.y);
					node = nextNode;
					param.y = bodyParam.y;
				} else {
					console.log("unknow node subTag: " + subTag);
					break;
				}
			} else if (nodeTag == 3 || nodeTag == 4) {
				//硬件节点或者函数节点
				node = findTargetNode(node, "B");
				param.y += defaultOffsetY;
			} else {
				console.log("unknow node type: " + nodeName);
				break;
			}
		}
		setNodePosition(node.data, param.x, param.y);
		return param;
	}

	function getConfig(name) {
		return configs[name];
	}

	function getModelData() {
		return diagram.model.toJson();
	}

	function load(modelData) {
		diagram.model = go.Model.fromJson(modelData);

		specNodes = {};
		specLinks = {};

		specNodes["start"] = findSpecNode("start");
		specNodes["loopStart"] = findSpecNode("loopStart");
		specNodes["loopEnd"] = findSpecNode("loopEnd");
		specNodes["end"] = findSpecNode("end");

		specLinks["start_loopStart"] = findSpecLink("start_loopStart");
		specLinks["loopStart_loopEnd"] = findSpecNode("loopStart_loopEnd");
		specLinks["loopEnd_loopStart"] = findSpecNode("loopEnd_loopStart");
		specLinks["loopEnd_end"] = findSpecNode("loopEnd_end");

		liveHardwareDrag();
	}

	return {
		init: init,
		findTargetNode: findTargetNode,
		findIfMergeNode: findIfMergeNode,
		findSpecNode: findSpecNode,
		makeImage: makeImage,
		getConfig: getConfig,
		getModelData: getModelData,
		load: load,
	}
});