define(['jquery', 'jquery-ui', 'goJS', "hardware", "code", "EventManager", "kenrobotDialog"], function($, _, _, hardware, code, EventManager, kenrobotDialog) {
	var GO;
	var diagram;
	var container;
	var configs;
	var defaultOffsetX = 100;
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

			//可以撤消(Ctrl + Z)和重做(Ctrl + Y)
			"undoManager.isEnabled": true,

			//显示网格
			// "grid.visible": true,
			// "grid.gridCellSize": new go.Size(20, 20),

			//鼠标滑轮缩放
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
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
		var toNode = findTargetNode(node, "L");
		var count = toNode.findLinksInto("T").iterator.count;
		while (count < 2) {
			var toNodeData = toNode.data;
			var category = toNodeData.category;
			if (category == "while") {
				toNode = findTargetNode(toNode, "R");
			} else if (category == "ifElse") {
				toNode = findIfMergeNode(toNode);
			} else {
				toNode = findTargetNode(toNode, "B");
			}
			count = toNode.findLinksInto("T").iterator.count;
		}
		return toNode;
	}

	//查找目标节点
	function findTargetNode(node, port) {
		var links = node.findLinksOutOf(port);
		var linksIter = links.iterator;
		linksIter.next();
		var link = linksIter.value;
		return link.toNode;
	}

	//查找特殊节点
	function findSpecNode(name) {
		return specNodes[name];
	}

	function makeImage(options) {
		return diagram.makeImage(options);
	}

	function test() {
		console.log(diagram.model.toJson());
	}

	function liveHardwareDrag() {
		$(".nav-second ul li ul li", container.parent()).draggable({
			appendTo: "body",
			scope: "software",
			revert: true,
			revertDuration: 0,
			zIndex: 999,
			containment: "window",
			cursorAt: {
				top: 15,
				left: 15
			},
			helper: onCreateDrag,
			start: onDragStart,
			stop: onDragStop,
		});
	}

	function onCreateDrag(e) {
		return $("div", this).clone();
	}

	function onDragStart(e, ui) {
		var element = ui.helper.first();
		var key = element.attr("data-key");
		var hardwareNodeData = hardware.getNodeData(key);
		if(hardwareNodeData.isController) {
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
			nodeData.portIndex = hardwareNodeData.portIndex;
			nodeData.bitIndex = hardwareNodeData.bitIndex;
		}

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
				addLink(nodeKey, toKey, "B", toPort);
			}
		});
		model.commitTransaction("addNode");

		autoConnect();
		EventManager.trigger("code", "refresh");
	}

	function onSelectionDeleting(e) {
		var node = e.subject.first();
		if (!node.deletable) {
			e.cancel = true;
			return;
		}

		var nodeData = node.data;
		var nodeTag = nodeData.tag;
		if (nodeTag == 2) {
			var subTag = nodeData.subTag;
			if (subTag == 1) {
				var yesNode = findTargetNode(node, "L");
				var noNode = findTargetNode(node, "R");
				if (yesNode != noNode) {
					e.cancel = true;
					alert("请先删除分支");
					return;
				}
			} else if (subTag == 2) {
				var bodyNode = findTargetNode(node, "B");
				if (bodyNode != node) {
					e.cancel = true;
					alert("请先删除循环体");
					return;
				}
			}
		}

		var fromKey, fromPort, toKey, toPort;
		var links = node.linksConnected.iterator;
		var model = diagram.model;
		while (links.next()) {
			var link = links.value;
			if (link.toNode !== link.fromNode) {
				if (link.toNode === node) {
					fromKey = model.getFromKeyForLinkData(link.data);
					fromPort = model.getFromPortIdForLinkData(link.data);
				} else {
					toKey = model.getToKeyForLinkData(link.data);
					toPort = model.getToPortIdForLinkData(link.data);
				}
			}
		}
		model.startTransaction("relink");
		addLink(fromKey, toKey, fromPort, toPort);
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

		if (!nodeData.initParams && !nodeData.params) {
			//没有参数
			return;
		}

		var nodeName = nodeData.name;
		var contents = [];

		var initParams = nodeData.initParams;
		if (initParams) {
			for (var i = 0; i < initParams.length; i++) {
				var param = initParams[i];
				if (!param.autoSet) {
					contents.push({
						"title": param.title,
						"inputType": param.inputType,
						"inputHolder": (param.inputHolder) ? param.inputHolder : "",
						"inputInitValue": param.defaultValue,
						"inputKey": "init_" + param.name,
					});
				}
			}
		}

		var params = nodeData.params;
		if (params) {
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

		contents.push({
			"title": "注释",
			"inputType": "none",
			"fontColor": "#BBBDBF",
			"showText": nodeData.desc || "暂无"
		});

		kenrobotDialog.show(0, {
			"title": "属性设置",
			"contents": contents
		}, function(data) {
			onEditNodeSave(nodeData, data);
		});
	}

	function onEditNodeSave(nodeData, data) {
		var params = nodeData.params;
		var initParams = nodeData.initParams;

		for (var name in data) {
			var value = data[name];
			var param;
			if (name.length > 5 && name.substr(0, 5) == "init_") {
				name = name.substr(5);
				param = findParam(initParams, name);
			} else {
				param = findParam(params, name);
			}
			param.defaultValue = value;
		}
		EventManager.trigger("code", "refresh");
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
		//hack，居中
		setNodePosition(startData, 0, -120);
		var loopStartData = addNode("loopStart", 0, -40);
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
		// model.commitTransaction("addLink");
		return linkData;
	}

	//自动连线
	function autoConnect() {
		var startNode = findSpecNode("start");
		var endNode = findSpecNode("end");
		var point = go.Point.parse(startNode.data.location);
		visitNode(startNode, endNode, {
			x: point.x,
			y: point.y
		});
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
					var yesParam = visitNode(yesNode, mergeNode, {
						x: param.x - defaultOffsetX,
						y: param.y + defaultOffsetY
					});
					var noParam = visitNode(noNode, mergeNode, {
						x: param.x + defaultOffsetX,
						y: param.y + defaultOffsetY
					});
					var mergeY = Math.max(yesParam.y, noParam.y);

					param.y = mergeY;
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

	return {
		init: init,
		findTargetNode: findTargetNode,
		findIfMergeNode: findIfMergeNode,
		findSpecNode: findSpecNode,
		makeImage: makeImage,
		test: test,
	}
});