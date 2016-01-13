define(['jquery', 'jquery-ui', 'goJS', "EventManager", "code"], function($, _, _, EventManager, code) {
	var GO;
	var diagram;
	var container;
	var configs;
	var specNodes;
	var targetPorts;

	function init(containerId, template, _configs) {
		configs = _configs;
		specNodes = {};
		targetPorts = [];

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
			"grid.visible": true,
			"grid.gridCellSize": new go.Size(20, 20),

			//鼠标滑轮缩放
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
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
			name: "hardware",
			linkFromPortIdProperty: "fromPort",
			linkToPortIdProperty: "toPort",
		});
		diagram.model = model;

		//拖拽
		container = $("#" + containerId);
		$(".nav-second ul li ul li", container.parent()).draggable({
			appendTo: "body",
			scope: "hardware",
			revert: true,
			revertDuration: 0,
			zIndex: 9999,
			containment: "window",
			cursorAt: {
				top: 15,
				left: 15
			},
			helper: onCreateDrag,
			start: onDragStart,
			stop: onDragStop,
		});
		container.droppable({
			scope: "hardware",
			over: onCanvasDropOver,
			out: onCanvasDropOut,
			drop: onCanvasDrop,
		});

		//添加初始节点
		addInitNodes();

		EventManager.bind("hardware", "editNode", onEditNode);
	}

	function makeImage(options) {
		return diagram.makeImage(options);
	}

	function getNodeData(key) {
		return diagram.model.findNodeDataForKey(key);
	}

	function test() {
		// console.log(diagram.model.toJson());
	}

	function onCreateDrag(e) {
		return $("img", this).clone();
	}

	function onDragStart(e, ui) {
		targetPorts = [];
		var element = ui.helper.first();
		var name = element.attr("data-name");
		var nodeConfig = getConfig(name);
		if(nodeConfig.max > 0) {
			var count = getNodeCount(name);
			if(count == nodeConfig.max) {
				return;
			}
		}
		var nodePort = nodeConfig.port;
	
		var boardNode = specNodes["board"];
		var boardData = boardNode.data;
		var boardPort = boardData.port;

		var result = "";
		for(var i = 0; i < boardPort.length; i++) {
			if(i % 9 == 8) {
				result += " ";
			} else if(nodePort[i] == "1" && boardPort[i] == "1") {
				result += "1";
			} else {
				result += "0";
			}
		}

		var bitsArray = result.split(" ");
		var targetBits = "";
		var replaceBits = "";
		var need_bit = nodeConfig.need_bit;
		for(var i = 0; i < need_bit; i++) {
			targetBits += "1";
			replaceBits += "0";
		}

		var ports = new go.List(go.Shape);
		ports.addAll(boardNode.ports);
		for(var i = 0; i < ports.count; i++) {
			var bits = bitsArray[i];
			var index = bits.indexOf(targetBits);
			if(index > -1) {
				targetPorts.push({
					portIndex: i,
					bitIndex: index,
					replaceBits: replaceBits,
					need_bit: need_bit,
					port: ports.get(i),
				});
			}
		}

		for(var i = 0; i < targetPorts.length; i++) {
			var targetInfo = targetPorts[i];
			var port = targetInfo.port;
			port.fill = "red";
		}
	}

	function onDragStop(e, ui) {
		for(var i = 0; i < targetPorts.length; i++) {
			var targetInfo = targetPorts[i];
			var port = targetInfo.port;
			port.fill = "#ccc";
		}
		targetPorts = [];
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

	function predicatePort(obj) {
		return (obj instanceof go.Shape) && obj.name == "PORT";
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
		var ports = new go.List(go.Shape);
		ports.addAll(diagram.findObjectsIn(rect, null, predicatePort, true));
		if (ports.count == 0) {
			return;
		}

		var port = ports.get(0);
		var targetInfo;
		for(var i = 0; i < targetPorts.length; i++) {
			var portInfo = targetPorts[i];
			if(portInfo.port == port) {
				targetInfo = portInfo;
				break;
			}
		}
		if(!targetInfo) {
			return;
		}

		point = port.getDocumentPoint(port.fromSpot);
		var x = point.x;
		var y = point.y;
		//是否需要翻转
		var needTurn = port.fromSpot == go.Spot.Bottom;
		var boardNode = specNodes["board"];
		var boardData = boardNode.data;
		
		var name = element.attr("data-name");
		var model = diagram.model;

		model.startTransaction("addNode");
		var nodeData = addNode(name, x, y);
		if(nodeData.need_pin_board){
			//需要转接板
			var hasPinboard = boardData.port.substr(targetInfo.portIndex * 9, 8) != "11111111";
			if(hasPinboard){
				//有转接板
				var adapterNode = findTargetNode(boardNode, port.portId);
				var adapterData = adapterNode.data;
				var offsetY = -(adapterData.height + 40 + nodeData.height / 2 + 40);
				if(needTurn) {
					//需要翻转
					setNodeAngle(nodeData, 180);
					offsetY = -offsetY;
				}
				setNodePosition(nodeData, x, y + offsetY);
				addLink(adapterData.key, nodeData.key, "T", "B");
			} else {
				//没有转接板
				var adapterData = addNode("adapter", x, y);
				var adapterOffsetY = -(adapterData.height / 2 + 40);
				var offsetY = -(adapterData.height + 40 + nodeData.height / 2 + 40);
				if(needTurn) {
					//需要翻转
					setNodeAngle(nodeData, 180);
					setNodeAngle(adapterData, 180);
					offsetY = -offsetY;
					adapterOffsetY = -adapterOffsetY;
				}
				setNodePosition(nodeData, x, y + offsetY);
				setNodePosition(adapterData, x, y + adapterOffsetY);
				addLink(boardData.key, adapterData.key, port.portId, "B");
				addLink(adapterData.key, nodeData.key, "T", "B");
			}
		} else {
			//不需要转接板
			var offsetY = -(nodeData.height / 2 + 40);
			if(needTurn) {
				//需要翻转
				setNodeAngle(nodeData, 180);
				offsetY = -offsetY;
			}
			setNodePosition(nodeData, x, y + offsetY);
			addLink(boardData.key, nodeData.key, port.portId, "B");
		}
		var bitIndex = targetInfo.bitIndex;
		var need_bit = targetInfo.need_bit;
		var index = targetInfo.portIndex * 9 + targetInfo.bitIndex;
		var oldPort = boardData.port;
		boardData.port = oldPort.substr(0, index) + targetInfo.replaceBits + oldPort.substr(index + targetInfo.replaceBits.length);
		nodeData.portIndex = targetInfo.portIndex;
		nodeData.bitIndex = targetInfo.bitIndex;
		if(name == "streeringEngine" || name == "dcMotor") {
			nodeData.index = getNodeCount(name) - 1;
			console.log("index " + nodeData.index);
		}
		
		model.commitTransaction("addNode");

		EventManager.trigger("hardware", "addNode", {
			name: name,
			text: nodeData.alias + "(" + port.portId + (need_bit > 1 ? bitIndex + "-" + (bitIndex + need_bit - 1) : bitIndex) + ")",
			key: nodeData.key,
		});

		if(name == "light") {
			EventManager.trigger("demo", "finishStep", [[1, 2], [2, 2], [3, 2], [7, 3]]);
		} else if(name == "switch") {
			EventManager.trigger("demo", "finishStep", [[3, 3]]);
		} else if(name == "dcMotor") {
			EventManager.trigger("demo", "finishStep", [[4, 2]]);
		} else if(name == "digitalTube") {
			EventManager.trigger("demo", "finishStep", [[5, 2], [6, 3]]);
		} else if(name == "temperatue") {
			EventManager.trigger("demo", "finishStep", [[6, 2]]);
		} else if(name == "illumination") {
			EventManager.trigger("demo", "finishStep", [[7, 2]]);
		}
	}

	function getNodeCount(name) {
		var nodes = diagram.model.nodeDataArray;
		var count = 0;
		for(var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if(node.name == name) {
				count++;
			}
		}
		return count;
	}

	function onSelectionDeleting(e) {
		var node = e.subject.first();
		if(!node.deletable) {
			e.cancel = true;
			return;
		}

		var sourceNode = findSourceNode(node, "B");
		var sourceData = sourceNode.data;
		if(sourceData.name == "adapter") {
			var outNodes = sourceNode.findLinksOutOf("T");
			if(outNodes.iterator.count == 1) {
				diagram.remove(sourceNode);
			}
		}
	}

	function onSelectionDeleted(e) {
		var node = e.subject.first();
		var nodeData = node.data;

		var replaceBits = "";
		var need_bit = nodeData.need_bit;
		for(var i = 0; i < need_bit; i++) {
			replaceBits += "1";
		}
		var index = nodeData.portIndex * 9 + nodeData.bitIndex;
		var boardNode = specNodes["board"];
		var boardData = boardNode.data;
		var oldPort = boardData.port;
		boardData.port = oldPort.substr(0, index) + replaceBits + oldPort.substr(index + replaceBits.length);

		EventManager.trigger("hardware", "deleteNode", {
			key: nodeData.key,
		});
	}

	function onEditNode(e) {

	}

	//添加初始节点
	function addInitNodes() {
		var boardData = addNode("board");
		specNodes["board"] = diagram.findNodeForData(boardData);

		setTimeout(function(){
			EventManager.trigger("hardware", "addNode", {
				name: boardData.name,
				text: boardData.alias,
				key: boardData.key,
			});
		}, 100);
	}

	//添加节点
	function addNode(name, x, y) {
		var config = getConfig(name);
		var nodeData = $.extend(true, {}, config);
		var timeStamp = new Date().getTime();
		nodeData.key = name + "_" + timeStamp;
		if(typeof(x) == "number" && typeof(y) == "number") {
			nodeData.location = x + " " + y;
		}
		var model = diagram.model;
		// model.startTransaction("addNode");
		model.addNodeData(nodeData);
		// model.commitTransaction("addNode");

		return nodeData;
	}

	//查找目标节点
	function findTargetNode(node, port) {
		var links = node.findLinksOutOf(port);
		var linksIter = links.iterator;
		linksIter.next();
		var link = linksIter.value;
		return link.toNode;
	}

	//查找目标节点
	function findSourceNode(node, port) {
		var links = node.findLinksInto(port);
		var linksIter = links.iterator;
		linksIter.next();
		var link = linksIter.value;
		return link.fromNode;
	}

	//设置节点位置
	function setNodePosition(nodeData, x, y) {
		diagram.model.setDataProperty(nodeData, "location", x + " " + y);
	}

	function setNodeAngle(nodeData, angle) {
		diagram.model.setDataProperty(nodeData, "angle", angle);
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

	function getConfig(name) {
		return configs[name];
	}

	return {
		init: init,
		makeImage: makeImage,
		getNodeData: getNodeData,
		test: test,
	}
});