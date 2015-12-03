define(["jquery", "jquery-ui", "jquery-menu", "jsplumb", "eventcenter", "genC"], function($, _, _, jsPlumb, eventcenter, genC) {
	var jsPlumb_container = 'flowchart-container';
	var jsPlumb_instance = null;
	var jsPlumb_nodes = [];
	var jsPlumb_selected_node = null;
	var flowchart = null;

	var container_width = 0;
	var container_height = 0;

	var data_transfer = {};

	var focus_endpoint_uuid = "";
	var configs = null;
	var itemClass = null;
	var defaultOffsetX = 100;
	var defaultOffsetY = 70;


	function init(itemCls, strContainer, flowcharts) {
		jsPlumb_container = strContainer;
		itemClass = itemCls;
		configs = flowcharts;

		container_width = $('#' + jsPlumb_container).width();
		container_height = $('#' + jsPlumb_container).height();

		jsPlumb.ready(onReady);

		$(window).resize(onWindowResize);

		// 右键菜单
		rightClick();

		movePanel();

		genC.refresh();
	}

	function onReady() {
		initJsPlumbInstance();

		initDraggable(itemClass);

		$('#' + jsPlumb_container).on('drop', function(ev) {
			finishDrag(ev);
		}).on('dragover', function(ev) {
			checkLinkEndpoint(ev);
			ev.preventDefault();
		}).on('dragleave', function(ev) {
			returnToInitStatus();
			ev.preventDefault();
		});

		jsPlumb.fire("jsFlowLoaded", jsPlumb_instance);

		initStartAndEnd();
	}

	function onWindowResize(e) {
		var width = $('#' + jsPlumb_container).width();
		var height = $('#' + jsPlumb_container).height();
		var offsetX = (width - container_width) / 2;
		var offsetY = (height - container_height) / 2;
		container_width = width;
		container_height = height;

		moveAllNodes(offsetX, offsetY);
	}

	function rightClick() {
		var selectorClass = "." + jsPlumb_container + "-item";
		$.contextMenu({
			selector: selectorClass,
			callback: function(key, options) {
				switch (key) {
					case 'delete':
						deleteNodeByElement(this);
						break;
					case 'edit':
						editNodeByElement(this);
						break;
				}
			},
			items: {
				"edit": {
					name: "Edit",
					icon: "edit"
				},
				"delete": {
					name: "Delete",
					icon: "delete"
				},
				"sep1": "---------",
				"quit": {
					name: "Quit",
					icon: "quit"
				}
			}
		});
	}

	function movePanel() {
		$('#' + jsPlumb_container).mousedown(function(e) {
			if ($(e.target).attr('id') == jsPlumb_container) {
				// 相对于屏幕的鼠标点击的起始位置
				var startX = e.pageX;
				var startY = e.pageY;
				var isMoving = true;
				$('#' + jsPlumb_container).css({
					cursor: 'move'
				});
				$(document).bind({
					mouseup: function(e) {
						isMoving = false;
						$('#' + jsPlumb_container).css({
							cursor: 'auto'
						});
					},
					mouseout: function(e) {
						isMoving = false;
						$('#' + jsPlumb_container).css({
							cursor: 'auto'
						});
					},
					mousemove: function(e) {
						if (isMoving) {
							var nowX = e.pageX;
							var nowY = e.pageY;
							var offsetX = nowX - startX;
							var offsetY = nowY - startY;
							startX = nowX;
							startY = nowY;
							moveAllNodes(offsetX, offsetY);
						}
					}
				});
			}
		});
	}

	function initJsPlumbInstance() {
		var color = "#E8C870";
		jsPlumb_instance = jsPlumb.getInstance({
			Connector: ["Flowchart", {
				gap: 4,
				// curviness: 50,
				// midpoint: 1,
				// stub: 20,
				cornerRadius: 5,
				// alwaysRespectStubs: true
			}],
			DragOptions: {
				cursor: "pointer",
				zIndex: 2000
			},
			PaintStyle: {
				strokeStyle: color,
				lineWidth: 2
			},
			EndpointStyle: {
				radius: 5,
				fillStyle: color
			},
			HoverPaintStyle: {
				strokeStyle: "#7073EB"
			},
			EndpointHoverStyle: {
				fillStyle: "#7073EB"
			},
			ConnectionOverlays: [
				["Arrow", {
					width: 10,
					length: 10,
					location: 1
				}]
			],
			Container: jsPlumb_container,
			// connectorStyle: {
			// 	outlineWidth: 2,
			// 	outlineColor: "WHITE"
			// }
		});
		jsPlumb_instance.bind("dblclick", function(conn, e) {
			// jsPlumb_instance.detach(conn);
		});
	}

	function initStartAndEnd() {
		var left = container_width / 2 - 30;
		var offsetY = container_height / 2 - 140

		//开始
		var startNodeParam = {};
		startNodeParam['x'] = left;
		startNodeParam['y'] = offsetY;
		startNodeParam['id'] = "flowchart_start_" + (new Date().getTime());
		startNodeParam['data-item'] = "flowchart_start_item";
		startNodeParam['text'] = "开 始";
		var startNode = initNode(startNodeParam);
		var startEndPoints = jsPlumb_instance.getEndpoints($(startNode));

		//loop开始
		var loopStartNodeParam = {};
		loopStartNodeParam['x'] = left;
		loopStartNodeParam['y'] = offsetY + 80;
		loopStartNodeParam['id'] = "flowchart_loopStart_" + (new Date().getTime());
		loopStartNodeParam['data-item'] = "flowchart_loopStart_item";
		loopStartNodeParam['text'] = "loop开始";
		var loopStartNode = initNode(loopStartNodeParam);
		var loopStartEndPoints = jsPlumb_instance.getEndpoints($(loopStartNode));
		connectPortsBySt(startEndPoints[0], loopStartEndPoints[0]);

		//loop结束
		var loopEndNodeParam = {};
		loopEndNodeParam['x'] = left;
		loopEndNodeParam['y'] = offsetY + 160;
		loopEndNodeParam['id'] = "flowchart_loopEnd_" + (new Date().getTime());
		loopEndNodeParam['data-item'] = "flowchart_loopEnd_item";
		loopEndNodeParam['text'] = "loop结束";
		var loopEndNode = initNode(loopEndNodeParam);
		var loopEndEndPoints = jsPlumb_instance.getEndpoints($(loopEndNode));
		connectPortsBySt(loopStartEndPoints[1], loopEndEndPoints[0]);

		var connector = ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }];
		loopEndEndPoints[2].connector = connector;
		loopStartEndPoints[2].connector = connector;
		connectPortsBySt(loopEndEndPoints[2], loopStartEndPoints[2]);

		//结束
		var endNodeParam = {};
		endNodeParam['x'] = left;
		endNodeParam['y'] = offsetY + 240;
		endNodeParam['id'] = "flowchart_end_" + (new Date().getTime());
		endNodeParam['data-item'] = "flowchart_end_item";
		endNodeParam['text'] = "结 束";
		var endNode = initNode(endNodeParam);
		var endEndPoints = jsPlumb_instance.getEndpoints($(endNode));
		connectPortsBySt(loopEndEndPoints[1], endEndPoints[0]);

		autoConnect();
	}

	function initDraggable(itemClass) {
		$('div.' + itemClass).parent().attr('draggable', 'true').on('dragstart', function(ev) {
			initDrag(ev, this);
		}).on('touchstart', function(ev) {
			initDrag(ev, this);
		});
	}

	function initDrag(e, target) {
		var drag = $('div', target);
		if (drag.attr('data-item') == 'flowchart_board_item') {
			return false;
		}

		try {
			var width = drag.width();
			var height = drag.height();
			e.originalEvent.dataTransfer.setDragImage(drag[0], width / 2, height / 2);
			e.originalEvent.dataTransfer.setData('text', drag.attr('id'));
			e.originalEvent.dataTransfer.setData('offsetX', e.originalEvent.offsetX);
			e.originalEvent.dataTransfer.setData('offsetY', e.originalEvent.offsetY);
		} catch (ev) {
			data_transfer['text'] = drag.attr('id');
			data_transfer['offsetX'] = e.originalEvent.offsetX;
			data_transfer['offsetY'] = e.originalEvent.offsetY;
		}
	}

	function finishDrag(e) {
		//拖拽对象不是连接点的时候
		if (e.target.closest("div").className.indexOf('_jsPlumb') < 0 || e.target.closest("div").className.indexOf(jsPlumb_container + '-item') < 0) {
			return false;
		}
		var targetNodeType = $(e.target).attr('data-item');
		if(targetNodeType == "flowchart_loopEnd_item" || targetNodeType == "flowchart_end_item"){
			return false;
		}
		e.preventDefault();
		
		//生成流程图元素的样式、位置
		var param = {};
		var objId = "";
		var startOffsetX = 0;
		var startOffsetY = 0;
		try {
			objId = e.originalEvent.dataTransfer.getData('text');
			startOffsetX = e.originalEvent.dataTransfer.getData('offsetX');
			startOffsetY = e.originalEvent.dataTransfer.getData('offsetY');
		} catch (ev) {
			objId = data_transfer['text'];
			startOffsetX = data_transfer['offsetX'];
			startOffsetY = data_transfer['offsetY'];
		}

		var x = e.originalEvent.offsetX - startOffsetX;
		var y = e.originalEvent.offsetY - startOffsetY;
		param['x'] = x;
		param['y'] = y;

		var nodeType = $("#" + objId).attr('data-item');
		var varName = $("#" + objId).attr('data-var-name');
		param['id'] = objId + "_" + (new Date().getTime());
		param['data-item'] = nodeType;
		param['text'] = $("#" + objId).text();
		param.varName = varName || "";
		if (param['text'].length == 0) {
			param['text'] = $("#" + objId).parent().text();
		}

		if (nodeType== "flowchart_tjfz_item") {
			var mergeNodeParam = {};
			mergeNodeParam['id'] = "flowchart_tjfzMerge_" + (new Date().getTime());
			mergeNodeParam['x'] = param['x'];
			mergeNodeParam['y'] = param['y'];
			mergeNodeParam['text'] = "分支合并";
			mergeNodeParam['data-item'] = "flowchart_tjfzMerge_item";

			var mergeNode = initNode(mergeNodeParam);
			var mergeNodeEndPoints = jsPlumb_instance.getEndpoints($(mergeNode));
			//若拖拽进入已有元素，则自动连接
			initConnection(mergeNode, e.target, x, y, 0, 40);
		}
		var node = initNode(param);

		//若拖拽进入已有元素，则自动连接
		initConnection(node, e.target, x, y);

		try {
			e.originalEvent.dataTransfer.clearData();
		} catch (ev) {
			data_transfer = {};
		}

		autoConnect();
		var nodeConfig = getConfig(nodeType);

		genC.refresh();
	}

	function autoConnect(){
		flowchart = getFlowchartElements();

		var startNode = findNode("flowchart_start");
		var endNode = findNode("flowchart_end");

		if (startNode == null || endNode == null) {
			return;
		}

		visitNode(startNode.id + "_BottomCenter", endNode.id + "_TopCenter", {x: startNode.x, y: startNode.y + defaultOffsetY});
	}

	//寻找节点
	function findNode(prefix) {
		var nodes = flowchart.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.id.indexOf(prefix) != -1) {
				return node;
			}
		}
		return null;
	}

	function visitNode(nodeId, endNodeId, param) {
		var linkInfo = getLinkInfo(nodeId);
		if(!linkInfo){
			return param;
		}

		var targetId = linkInfo.targetId;
		if(targetId == endNodeId) {
			repaintNode(targetId, param.x, param.y);
			return param;
		}

		var nodeName = targetId.split("_")[1];
		var nodeConfig = configs[nodeName];
		var nodeTag = nodeConfig.tag;
		var subTag = nodeConfig.subTag;

		if (nodeConfig === undefined) {
			//找不到节点配置
			console.log("unknow node: " + nodeName);
			return param;
		}

		var nodeInfo = getNodeInfo(targetId);
		if (nodeInfo == null) {
			//找不到节点信息
			console.log("can not find node info: " + nodeName);
			return param;
		}

		if (nodeTag == 1) {
			repaintNode(targetId, param.x, param.y);
			return visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, {x: param.x, y: param.y + defaultOffsetY});
		} else if (nodeTag == 2) {
			if (subTag == 1) {
				//循环
				var bodyParam = visitNode(targetId.replace("TopCenter", "BottomCenter"), targetId.replace("TopCenter", "LeftMiddle"), {x: param.x, y: param.y + defaultOffsetY});
				repaintNode(targetId, param.x, param.y);
				return visitNode(targetId.replace("TopCenter", "RightMiddle"), endNodeId, {x: param.x, y: bodyParam.y + defaultOffsetY});
			} else if (subTag == 2) {
				//条件分支
				repaintNode(targetId, param.x, param.y);
				var mergeId = targetId.substring(0, targetId.lastIndexOf("_")).replace("tjfz", "tjfzMerge");
				var yesParam = visitNode(targetId.replace("TopCenter", "BottomCenter"), mergeId + "_TopCenter", {x: param.x, y: param.y + defaultOffsetY});
				var noParam = visitNode(targetId.replace("TopCenter", "RightMiddle"), mergeId + "_RightMiddle", {x: param.x + defaultOffsetX, y: param.y + defaultOffsetY});
				var mergeY = Math.max(yesParam.y, noParam.y);
				repaintNode(mergeId + "_BottomCenter", param.x, mergeY);
				return visitNode(mergeId + "_BottomCenter", endNodeId, {x: param.x, y: mergeY + defaultOffsetY});
			} else if(subTag == 3) {
				//do nothing
			} else {
				console.log("unknow node sub type: " + subTag);
			}
		} else if (nodeTag == 3 || nodeTag == 4) {
			//硬件节点或者函数节点
			repaintNode(targetId, param.x, param.y);
			return visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, {x: param.x, y: param.y + defaultOffsetY});
		} else {
			console.log("unknow node type: " + nodeTag);
		}
		return param;
	}

	function getNodeInfo(nodeId) {
		nodeId = nodeId.substring(0, nodeId.lastIndexOf("_"));

		var nodes = flowchart.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var nodeInfo = nodes[i];
			if (nodeInfo.id == nodeId) {
				return nodeInfo;
			}
		}
		return null;
	}

	function getLinkInfo(sourceId) {
		var links = flowchart.links;
		for (var i = 0; i < links.length; i++) {
			var linkInfo = links[i];
			if (linkInfo.sourceId == sourceId) {
				return linkInfo;
			}
		};
		return null;
	}

	function repaintNode(nodeId, x, y) {
		nodeId = nodeId.substring(0, nodeId.lastIndexOf("_"));
		$('#' + nodeId).css({
			left: x,
			top: y,
		});
		var node = jsPlumb.getSelector('#' + nodeId)[0];
		jsPlumb_instance.repaint(node);
	}

	function initNode(param) {
		var node = addNode(jsPlumb_container, param);
		jsPlumb_nodes.push(param);
		if (node === false) {
			return false;
		}
		addPorts(node);

		//根据元素类型初始化连接
		addConnection(node);

		return node;
	}

	function addNode(parentId, param) {
		var type = param['data-item'];
		var config = getConfig(type);

		if(!config){
			console.log("unknow config type " + type);
			return false;
		}

		if (config.unique && $("div[data-item='" + type + "']", $("#" + parentId)).length > 0) {
			alert("指定流程元素在流程中只能使用一次");
			return false;
		}

		var panel = $("#" + parentId);
		var showText = param['text'];
		var nodeDiv = $('<div>').appendTo(panel)
			.css({
				position: 'absolute',
				top: param['y'],
				left: param['x']
			})
			.attr('align', 'center')
			.attr('id', param['id'])
			.attr('data-item', type)
			.addClass(config.className)
			.addClass('node')
			.addClass(jsPlumb_container + '-item')
		if(config.tag != 3)
			nodeDiv.text(showText);
		return jsPlumb.getSelector('#' + param['id'])[0];
	}

	function addPorts(node) {
		if (node == null) {
			return false;
		}
		//Assume horizental layout
		var config = getConfig($(node).attr('data-item'));
		var arrAnchor = config.points;
		for (var i = 0; i < arrAnchor.length; i++) {
			var tmpUuid = node.getAttribute("id") + "_" + arrAnchor[i].position;
			var endPoint = jsPlumb_instance.addEndpoint(node, {
				uuid: tmpUuid,
				paintStyle: {
					radius: 5,
					fillStyle: arrAnchor[i].color
				},
				anchor: arrAnchor[i].position,
				maxConnections: -1,
				isSource: arrAnchor[i].source,
				isTarget: arrAnchor[i].target,
				//连线不能被手动删除
				connectionsDetachable: false,
				connectorStyle: {
					lineWidth: 2,
					strokeStyle: "#61B7CF",
					joinstyle: "round",
					outlineColor: "#EEE"
						// outlineWidth: 2
				}
			});
		}
	}

	function addConnection(node) {
		var nodeType = getConfig($(node).attr("data-item")).type;
		if (!nodeType) {
			return;
		}

		var nodeEndpoints = jsPlumb_instance.getEndpoints($(node));
		if (nodeType == "loop") {
			var initSourceEndpoint = null;
			var initTargetEndpoint = null;
			for (var i = 0; i < nodeEndpoints.length; i++) {
				if (nodeEndpoints[i].anchor.type == "BottomCenter" && nodeEndpoints[i].isSource) {
					initSourceEndpoint = nodeEndpoints[i];
				}
				if (nodeEndpoints[i].anchor.type == "LeftMiddle" && nodeEndpoints[i].isTarget) {
					initTargetEndpoint = nodeEndpoints[i];
				}
			}
			if (initSourceEndpoint != null && initTargetEndpoint != null) {
				connectPortsBySt(initSourceEndpoint, initTargetEndpoint);
			}
		}
	}

	function initConnection(node, target, centerX, centerY, offsetX, offsetY) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		var targetDiv = target.closest("div");
		//拖拽位置所指对象的位置
		var baseX = $(targetDiv).position().left;
		var baseY = $(targetDiv).position().top;

		//实际元素当前中心位置
		var realX = $(node).outerWidth() / 2 + centerX;
		var realY = $(node).outerHeight() / 2 + centerY;

		var sourceEndPoint = null;
		if (focus_endpoint_uuid.length > 0) {
			sourceEndPoint = jsPlumb_instance.getEndpoint(focus_endpoint_uuid);
		} else {
			sourceEndPoint = getNearestEndPoint(targetDiv, realX, realY);
		}
		if (sourceEndPoint == null) {
			jsPlumb_instance.remove($(node));
			return false;
		}

		//获取起始连接点的属性
		var sourceFis = getConfig($(sourceEndPoint.getElement()).attr("data-item"));
		//根据最近的起始连接点重定位新流程元素位置
		var objX = 0;
		var objY = 0;

		var relativeDistance = getLeftTopToSourceEndpointDistance(node);

		baseX = baseX + $(targetDiv).outerWidth() / 2 - $(node).outerWidth() / 2;
		switch (sourceEndPoint.anchor.type) {
			case "TopCenter":
				objX = baseX;
				objY = baseY - $(targetDiv).outerHeight() - 30;
				break;
			case "RightMiddle":
				objX = baseX + $(node).outerWidth() + 30;
				// objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 30;
				break;
			case "BottomCenter":
				objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 30;
				break;
			case "LeftMiddle":
				// objX = baseX - $(node).outerWidth() - 20;
				objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 30;
				break;
			default:
				break;
		}

		objX += offsetX;
		objY += offsetY;
		$(node).css({
			top: objY,
			left: objX
		});
		//重绘流程元素
		jsPlumb_instance.repaint(node);

		var targetEndPoints = jsPlumb_instance.getEndpoints($(node));

		var targetEndPoint = null;
		for (var i = 0; i < targetEndPoints.length; i++) {
			if (!targetEndPoints[i].isTarget) continue;
			targetEndPoint = targetEndPoints[i];
			break;
		}

		connectPortsBySt(sourceEndPoint, targetEndPoint);

		moveRelationalNodes(sourceEndPoint, node, sourceEndPoint, "down");

		//截断需截断连接，重新连接
		cutAndLink(sourceEndPoint, node);
	}

	function moveRelationalNodes(sourceEndPoint, node, fixedSourceEndPoint, mode) {
		var connections = jsPlumb_instance.getConnections({
			source: sourceEndPoint.getElement()
		});
		//从同一个起点衍生出多个点时，需要将所有流程元素下移，除了刚刚绘制的流程元素
		var nodeType = getConfig($(sourceEndPoint.getElement()).attr("data-item")).type;

		var compareId = "";
		for (var i = 0; i < connections.length; i++) {
			//判定该连接终点元素是不是刚刚绘制的node元素，通过ID判定
			if ($(node).attr('id') == connections[i].targetId) {
				continue;
			}
			//非起始fixedSourceEndPoint出来的连接不进行处理
			if ($(fixedSourceEndPoint.getElement()).attr("id") == connections[i].sourceId && fixedSourceEndPoint.getUuid() != connections[i].endpoints[0].getUuid()) {
				continue;
			}
			//如果终点在循环元素上，则循环继续
			var targetType = getConfig($(connections[i].target).attr("data-item")).type;
			var sourceType = getConfig($(connections[i].source).attr("data-item")).type;
			var nodeType = getConfig($(node).attr("data-item"), "type");
			if (targetType && targetType == "loop") {
				continue;
			}

			if (targetType && sourceType && sourceType == "loopEnd" && targetType == "loopStart") {
				continue;
			}

			if (connections[i].targetId == compareId) continue;

			var positionX = $(connections[i].target).position().left;
			var positionY = $(connections[i].target).position().top;
			if (mode == "right" && connections[i].targetId.indexOf("_end_") < 0) {
				positionY -= 20;
				$(connections[i].target).css("top", positionY);
				positionX += $(connections[i].target).outerWidth() + 20;
				$(connections[i].target).css("left", positionX);
			} else if (mode == "up") {
				positionY -= $(connections[i].target).outerHeight() + 20;
				$(connections[i].target).css("top", positionY);
			} else {
				positionY += $(connections[i].target).outerHeight() + 20;
				if (nodeType == "loop") {
					positionY += 30;
				} else if(nodeType == "tjfzMerge") {
					positionY += 30;
				}
				$(connections[i].target).css("top", positionY);
			}
			//重绘流程元素
			jsPlumb_instance.repaint(connections[i].target);
			arguments.callee(connections[i].endpoints[1], node, fixedSourceEndPoint, mode);
		}
	}

	function moveAllNodes(offsetX, offsetY) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;

		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			moveOneNode(jsPlumb_nodes[i]['id'], offsetX, offsetY);
		}
	}

	function moveOneNode(id, offsetX, offsetY) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		if(offsetX == 0 && offsetY == 0){
			return;
		}

		var node = jsPlumb.getSelector('#' + id);
		var pos = $(node).position();
		$(node).css({
			left: pos.left + offsetX,
			top: pos.top + offsetY,
		});

		//重绘流程元素
		jsPlumb_instance.repaint(node);
	}

	/**
	 * @desc 截断需截断连接，重新连接
	 * @param EndPoint sourceEndPoint 起始点
	 * @param Node node 新绘制元素
	 */
	function cutAndLink(sourceEndPoint, node) {
		//在新的元素上获取打断重连的起点
		var arrSourceTargetEndPoint = [];
		var sourceEndPoints = jsPlumb_instance.getEndpoints($(node));

		var tmpObjType = getConfig($(node).attr("data-item")).type;
		for (var i = 0; i < sourceEndPoints.length; i++) {
			if (!sourceEndPoints[i].isSource) continue;
			if (tmpObjType && tmpObjType == "loop") {
				//循环则将起始点设置为右边连接点
				if (sourceEndPoints[i].anchor.type == "RightMiddle") {
					arrSourceTargetEndPoint.push(sourceEndPoints[i]);
					break;
				}
			} else if (tmpObjType && tmpObjType == "if") {
				arrSourceTargetEndPoint.push(sourceEndPoints[i]);
			} else {
				arrSourceTargetEndPoint.push(sourceEndPoints[i]);
				break;
			}
		}
		var connections = jsPlumb_instance.getConnections({
			source: sourceEndPoint.getElement()
		});
		var connectionToNode = null;
		var tmpLabel = "";
		for (var i = 0; i < connections.length; i++) {
			if ($(node).attr('id') == connections[i].targetId) {
				connectionToNode = connections[i];
				continue;
			}
			if (sourceEndPoint.getUuid() != connections[i].endpoints[0].getUuid()) continue;
			tmpLabel = connections[i].getLabel();
			jsPlumb_instance.detach(connections[i]);
			for (var j = 0; j < arrSourceTargetEndPoint.length; j++) {
				if (tmpObjType && tmpObjType == "if") {
					var endPoint = connections[i].endpoints[1];
					var mergeNodeEndPoints = jsPlumb_instance.getEndpoints(endPoint.elementId);
					var conn = connectPortsBySt(arrSourceTargetEndPoint[j], mergeNodeEndPoints[j]);
					conn.setLabel({
						location: 0.5,
						label: j == 0 ? "Yes" : "No"
					});
				} else {
					connectPortsBySt(arrSourceTargetEndPoint[j], connections[i].endpoints[1]);
				}
			}
		}
		if (tmpLabel) {
			connectionToNode.setLabel(tmpLabel);
		}
	}

	/**
	 * @desc 从附着有endpoint的div中获取离指定x，y最近的起始endpoint
	 * @param element div 附着有endpoint的div
	 * @param float realX 当前元素实际中心点X位置
	 * @param float realY 当前元素实际中心点Y位置
	 */
	function getNearestEndPoint(div, realX, realY) {
		var sourceEndPoint = null;

		//拖拽位置所指对象的位置
		var baseX = $(div).position().left;
		var baseY = $(div).position().top;

		//获取拖拽位置所指对象的所有连接点endpoint
		var sourceEndPoints = jsPlumb_instance.getEndpoints(div);
		//根据拖拽放置情况获取离当前元素最近的连接点
		var distance = 0;
		for (var i = 0; i < sourceEndPoints.length; i++) {
			if (!sourceEndPoints[i].isSource) continue;
			//获取endpoint点所在流程元素中的相对位置
			var tmpY = $(sourceEndPoints[i].canvas).position().top - baseY;
			var tmpX = $(sourceEndPoints[i].canvas).position().left - baseX;
			if (distance == 0) {
				distance = Math.sqrt(Math.pow((realY - tmpY), 2) + Math.pow((realX - tmpX), 2));
				sourceEndPoint = sourceEndPoints[i];
			} else {
				var tmpDistance = Math.sqrt(Math.pow((realY - tmpY), 2) + Math.pow((realX - tmpX), 2));
				if (distance > tmpDistance) {
					distance = tmpDistance;
					sourceEndPoint = sourceEndPoints[i];
				}
			}
		}
		return sourceEndPoint;
	}

	function checkLinkEndpoint(e) {
		if (!$(e.target).is("div") || e.target.closest("div").className.indexOf('_jsPlumb') < 0)
			return false;

		var startOffsetX = 0;
		var startOffsetY = 0;
		try {
			startOffsetX = e.originalEvent.dataTransfer.getData('offsetX');
			startOffsetY = e.originalEvent.dataTransfer.getData('offsetY');
		} catch (ev) {
			startOffsetX = data_transfer['offsetX'];
			startOffsetY = data_transfer['offsetY'];
		}
		var check_endpoint_x = e.originalEvent.offsetX - startOffsetX;
		var check_endpoint_y = e.originalEvent.offsetY - startOffsetY;

		var sourceEndPoint = getNearestEndPoint(e.target, check_endpoint_x, check_endpoint_y);
		if (sourceEndPoint == null)
			return false;

		var conns = jsPlumb_instance.getConnections({
			source: sourceEndPoint.getElement()
		});
		for (var i = 0; i < conns.length; i++) {
			var tmpColor = "#E8C870";
			if (sourceEndPoint.getUuid() == conns[i].endpoints[0].getUuid()) {
				tmpColor = "red";
				focus_endpoint_uuid = sourceEndPoint.getUuid();
			}
			conns[i].setPaintStyle({
				strokeStyle: tmpColor
			});
		}
	}

	function returnToInitStatus() {
		$.each(jsPlumb_instance.getAllConnections(), function(id, connection) {
			for (var i in connection) {
				connection[i].setPaintStyle({
					strokeStyle: '#E8C870'
				});
			}
		});
		focus_endpoint_uuid = "";
	}

	function editNodeByElement(obj) {
		editNode(jsPlumb.getSelector('#' + $(obj).attr('id'))[0]);
	}

	function editNode(node) {
		jsPlumb_selected_node = node;
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var nodeInfo = jsPlumb_nodes[i];
			if ($(node).attr('id') == nodeInfo.id) {
				eventcenter.trigger("kenrobot", "flowchart_item_click", {
					id: nodeInfo.id,
					text: nodeInfo.text,
					type: getConfig($(node).attr("data-item")).type,
					add_info: nodeInfo.add_info,
					left: $(node).position().left,
					top: $(node).position().top
				});
				break;
			}
		}
	}

	// 根据html元素删除节点对象
	function deleteNodeByElement(obj) {
		var id = $(obj).attr('id');
		if(deleteNode(jsPlumb.getSelector('#' + id)[0])){
			autoConnect();
			genC.refresh();
		}
	}

	// 删除流程元素
	function deleteNode(node, from) {
		var nodeName = $(node).attr("data-item");
		var nodeConfig = getConfig(nodeName);
		if (nodeConfig.always) {
			alert("不可删除元素！");
			return false;
		}

		var nodeType = nodeConfig.type;
		if(nodeType == "tjfzMerge" && (from === undefined || from != "tjfz")){
			alert("请删除条件分支！");
			return false;
		}

		// 存在分支元素时节点元素不能删除
		var parentEndpoints = [];
		var childrenEndpoints = [];
		$.each(jsPlumb_instance.getConnections({
			source: $(node)
		}), function(i, o) {
			if (o.targetId != o.sourceId) {
				childrenEndpoints.push(o.endpoints[1]);
			}
		});
		$.each(jsPlumb_instance.getConnections({
			target: $(node)
		}), function(i, o) {
			if (o.targetId != o.sourceId) {
				parentEndpoints.push({
					endpoint: o.endpoints[0],
					label: o.getLabel()
				});
			}
		});
		if (childrenEndpoints.length > 1) {
			for (var i = 0; i < childrenEndpoints.length - 1; i++) {
				var onePoint = childrenEndpoints[i];
				var otherPoint = childrenEndpoints[i + 1];
				if (onePoint.getUuid() != otherPoint.getUuid() && onePoint.elementId != otherPoint.elementId) {
					alert("存在分支处理，无法删除！");
					return false;
				}
			}
		}
		var nodeId = $(node).attr('id');
		jsPlumb_instance.remove(node);

		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			if (jsPlumb_nodes[i]['id'] == $(node).attr('id')) {
				jsPlumb_nodes.splice(i, 1);
			}
		}

		$.each(parentEndpoints, function(i, o) {
			var tmpConnector = connectPortsBySt(o.endpoint, childrenEndpoints[0]);
			tmpConnector.setLabel({
				location: 0.1,
				label: o.label
			});
		});

		if(nodeType == "if"){
			var mergeNodeId = nodeId.replace("tjfz", "tjfzMerge");
			var mergeNode = jsPlumb.getSelector("#" + mergeNodeId)[0];
			deleteNode(mergeNode, "tjfz");
		}

		return true;
	}

	function getConfig(name) {
		var names = name.split('_');
		name = names.length > 1 ? names[1] : name;
		return configs[name];
	}

	function getSelectedJsPlumbNode(node) {
		return getSelectedJsPlumbNodeByObj($(node));
	}

	function getSelectedJsPlumbNodeByObj(obj) {
		var selectedNode = null;
		var selectedIndex = -1;
		for (var ijk = 0; ijk < jsPlumb_nodes.length; ijk++) {
			if (jsPlumb_nodes[ijk]['id'] == obj.attr('id')) {
				selectedNode = jsPlumb_nodes[ijk];
				selectedIndex = ijk;
			}
		}
		return {
			node: selectedNode,
			index: selectedIndex
		}
	}

	/**
	 * 连接两个endpoint
	 * @param string sourceId 起点endpoint的uuid	
	 * @param string targetId 终点endpoint的uuid
	 */
	function connectPortsByUuid(sourceId, targetId) {
		return jsPlumb_instance.connect({
			uuids: [sourceId, targetId]
		});
	}

	/**
	 * 连接两个endpoint
	 * @param string/endpoint source 起点	
	 * @param string/endpoint target 终点
	 */
	function connectPortsBySt(source, target) {
		return jsPlumb_instance.connect({
			source: source,
			target: target
		});
	}

	function getLeftTopToSourceEndpointDistance(node) {
		var endpoints = jsPlumb_instance.getEndpoints($(node));
		var nodeLeft = $(node).position().left;
		var sourceLeft = 0;
		for (var i = 0; i < endpoints.length; i++) {
			if (endpoints[i].isTarget) {
				sourceLeft = $(endpoints[i].canvas).position().left;
			}
		}
		return sourceLeft - nodeLeft;
	}

	/**
	 * 将目前绘制的流程图清除
	 */
	function clear() {
		$.each(jsPlumb_nodes, function(i, o) {
			jsPlumb_instance.remove(jsPlumb_instance.getSelector("#" + o['id'])[0]);
		});
		jsPlumb_nodes = [];
	}

	/**
	 * 获取展示中所有的元素，包括流程元素、线，主要用于绘制
	 */
	function getFlowchartElements() {
		var jsPlumb_links = [];
		$.each(jsPlumb_instance.getConnections(), function(id, connection) {
			jsPlumb_links.push({
				"sourceId": connection.endpoints[0].getUuid(),
				"sourceAnchorType": connection.endpoints[0].anchor.type,
				"targetId": connection.endpoints[1].getUuid(),
				"targetAnchorType": connection.endpoints[1].anchor.type,
			});
		});
		//更新每个点的实时坐标
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			jsPlumb_nodes[i]['x'] = $("#" + jsPlumb_nodes[i]['id']).position().left;
			jsPlumb_nodes[i]['y'] = $("#" + jsPlumb_nodes[i]['id']).position().top;
		}
		return {
			"nodes": jsPlumb_nodes,
			"links": jsPlumb_links
		};
	}

	/**
	 * 设置当前选中元素的额外附加信息
	 */
	function setSelectedNodeInfo(jsPlumb_add_info) {
		if (jsPlumb_selected_node == null) return false;
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			if ($(jsPlumb_selected_node).attr('id') == jsPlumb_nodes[i]['id']) {
				jsPlumb_nodes[i]['add_info'] = jsPlumb_add_info;
			}
		}
	}

	/**
	 * 根据点、线信息绘制流程图
	 * @param object flowchart {"nodes":[],"links":[]}格式数据，可通过getFlowchartElements获取
	 */
	function draw(flowchart) {
		if (jsPlumb_nodes.length > 0) {
			if (confirm("是否覆盖重绘?")) {
				clear();
			} else {
				return false;
			}
		}
		$.each(flowchart["nodes"], function(i, o) {
			var tmpNode = initNode(o);
			jsPlumb_instance.detachAllConnections($(tmpNode));
		});

		$.each(flowchart["links"], function(i, o) {
			var sourceId = o["sourceId"];
			var targetId = o["targetId"];
			connectPortsByUuid(sourceId, targetId);
		});
	}

	function isEmpty() {
		if (jsPlumb_nodes.length > 0) {
			return false;
		}
		return true;
	}

	return {
		init: init,
		initDraggable: initDraggable,
		getFlowchartElements: getFlowchartElements,
		draw: draw,
		isEmpty: isEmpty,
		setSelectedNodeInfo: setSelectedNodeInfo,
	}
});