/**
 * <div id="flowchart_if" data-item="flowchart_if_item" class="flowchart-item flowchart-prismatic">判定</div>
 *	右侧拖拽栏中的id只是用来最后的标志，虽然可以事后识别，但最好还是带上意义，比如if
 *	data-item对象才是重点，对应flowchart-item-set.js中配置的关键字
 *	参数jsPlumb_container所指定的区域是绘制流程图的区域，即id为jsPlumb_container的DIV
 *	需要为jsPlumb_container设定css样式，控制描图区域
 *	需要为jsPlumb_container+"-item"元素指定css样式，控制每个生成的流程元素块的大小
 */
define(["jquery", "jsplumb", "eventcenter", "d3", "flowchart_item_set", "genC", "jquery-ui", "jquery-menu"], function($, jsPlumb, eventcenter, d3, fis, genC) {
	var showGuide = null;

	function setShowGuid(show) {
		showGuide = show;
	}

	var jsPlumb_container = 'flowchart-container';
	var jsPlumb_instance = null;
	var jsPlumb_nodes = [];
	var jsPlumb_selected_node = null;

	var container_width = 0;

	var data_transfer = {};

	// 在鼠标移动过程中即将连接的点的暂存变量
	var focus_endpoint_uuid = "";

	/**
	 * 整个处理的入口，需要初始化
	 * @param string strContainer 用来绘制流程图的DIV
	 * @param string itemClass 可以拖拽的元素
	 */
	function init(itemClass, strContainer) {
		jsPlumb_container = strContainer;
		if (jsPlumb_container.length == 0) {
			alert("缺少搭建流程图的位置");
			return false;
		}

		container_width = $('#' + jsPlumb_container).width();

		jsPlumb.ready(function() {
			//Initialize JsPlumb
			initJsPlumbInstance();

			initDraggable(itemClass);

			$('#' + jsPlumb_container).on('drop', function(ev) {
				finishDrag(ev);
				if (showGuide)
					showGuide(4);
			}).on('dragover', function(ev) {
				checkLinkEndpoint(ev);
				ev.preventDefault();
			}).on('dragleave', function(ev) {
				returnToInitStatus();
				ev.preventDefault();
			});

			jsPlumb.fire("jsFlowLoaded", jsPlumb_instance);

			initStartAndEnd();
		});

		$(window).resize(function(e) {
			var new_container_width = $('#' + jsPlumb_container).width();
			var move_distance = (container_width - new_container_width) / 2;
			moveAllNodes(move_distance);
			container_width = new_container_width;
		});

		// 右键菜单
		rightClick();

		genC.refresh();

		movePanel();
	}

	function movePanel() {
		eventcenter.bind('flowchart', 'mousedown', function(e) {
			if ($(e.target).attr('id') == jsPlumb_container) {
				// 相对于屏幕的鼠标点击的起始位置
				var startX = e.pageX;
				var startY = e.pageY;
				var keepmoving = 1;
				$('#' + jsPlumb_container).css({
					cursor: 'move'
				});
				$(document).bind({
					mouseup: function(e) {
						keepmoving = -1;
						$('#' + jsPlumb_container).css({
							cursor: 'auto'
						});
					},
					mouseout: function(e) {
						keepmoving = -1;
						$('#' + jsPlumb_container).css({
							cursor: 'auto'
						});
					},
					mousemove: function(e) {
						if (keepmoving !== -1) {
							// 当前鼠标光标的位置
							var nowX = e.pageX;
							var nowY = e.pageY;
							// 相对于鼠标点击起始位置的偏移量
							var offsetDistanceX = nowX - startX;
							var offsetDistanceY = nowY - startY;

							moveAllNodes(-offsetDistanceX, -offsetDistanceY);

							startX = nowX;
							startY = nowY
						}
					}
				});
			}
		});
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
						if (showGuide) {
							showGuide(5)
						};
						break;
					default:
						break;
				}
			},
			items: {
				"edit": {
					name: "Edit",
					icon: "edit"
				},
				// "cut": {name: "Cut", icon: "cut"},
				// "copy": {name: "Copy", icon: "copy"},
				// "paste": {name: "Paste", icon: "paste"},
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

	function editNodeByElement(obj) {
		editNode(jsPlumb.getSelector('#' + $(obj).attr('id'))[0]);
	}

	function editNode(node) {
		var divElement = $("#" + $(node).attr('id'));
		$(".flowchart-item-border-show").removeClass("flowchart-item-border-show");
		divElement.addClass("flowchart-item-border-show");
		jsPlumb_selected_node = node;
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			if ($(jsPlumb_selected_node).attr('id') == jsPlumb_nodes[i]['id']) {
				// if (jsPlumb_nodes[i] && (jsPlumb_nodes[i]['add_info'] == null || jsPlumb_nodes[i]['add_info'] == undefined)) {
				// 	jsPlumb_nodes[i]['add_info'] = "";
				// }
				var nodeKind = getNodeInfoByKey($(jsPlumb_selected_node).attr("data-item"), "kind");
				eventcenter.trigger("kenrobot", "flowchart_item_click", {
					"id": jsPlumb_nodes[i]['id'],
					"text": jsPlumb_nodes[i]['text'],
					"kind": nodeKind,
					"type": getNodeInfoByKey($(jsPlumb_selected_node).attr("data-item"), "type"),
					"options": getNodeInfoByKey($(jsPlumb_selected_node).attr("data-item"), "setOptions"),
					"desc": getNodeInfoByKey($(jsPlumb_selected_node).attr("data-item"), "desc"),
					"add_info": jsPlumb_nodes[i]['add_info'],
					"left": $(jsPlumb_selected_node).position().left,
					"top": $(jsPlumb_selected_node).position().top
				});
				break;
			}
		}
	}

	// 根据html元素删除节点对象
	function deleteNodeByElement(obj) {
		deleteNode(jsPlumb.getSelector('#' + $(obj).attr('id'))[0]);

		genC.refresh();
	}

	// 删除流程元素
	function deleteNode(node) {
		var objSet = fis[$(node).attr("data-item")];
		if (objSet['always'] !== undefined && objSet['always'] == true) {
			alert("不可删除元素！");
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
				if (childrenEndpoints[i].getUuid() != childrenEndpoints[i + 1].getUuid()) {
					alert("存在分支处理，无法删除！");
					return false;
				}
			}
		}
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
	}

	/**
	 * @desc 将所有的连接线返回到初始状态色
	 */
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

	/**
	 * @desc 确定可以连接的Endpoint，并将该Endpoint上的连接线高亮标红
	 * @param event e 鼠标拖拽事件Event
	 */
	function checkLinkEndpoint(e) {
		if (!$(e.target).is("div") || e.target.closest("div").className.indexOf('_jsPlumb') < 0) return false;

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

		var tmpElement = $("<div></div>").addClass(getNodeInfoByKey($(e.target).attr('data-item'), "className"));
		$("body").append(tmpElement);
		tmpElement.hide();

		var realX = tmpElement.outerWidth() / 2 + check_endpoint_x;
		var realY = tmpElement.outerHeight() / 2 + check_endpoint_y;

		var sourceEndPoint = getNearestEndPoint(e.target, check_endpoint_x, check_endpoint_y);

		if (sourceEndPoint == null) return false;
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

	/**
	 * @desc 为指定class的div提供拖拽支持
	 * @param string itemClass
	 */
	function initDraggable(itemClass) {
		$('div.' + itemClass).attr('draggable', 'true').on('dragstart', function(ev) {
			if ($(this).attr('data-item') == 'flowchart_board_item') {
				return false;
			}
			initDrag(ev, this);
		}).on('touchstart', function(ev) {
			if ($(this).attr('data-item') == 'flowchart_board_item') {
				return false;
			}
			initDrag(ev, this);
		});
	}

	/**
	 * @desc 在水平方向上移动所有的元素
	 * @param double distance 移动距离
	 */
	// function moveAllNodes(distance){
	// 	for(var i=0;i<jsPlumb_nodes.length;i++){
	// 		var node=jsPlumb.getSelector('#' + jsPlumb_nodes[i]['id'])[0];
	// 		var left=$('#' + jsPlumb_nodes[i]['id']).position().left;
	// 		$(node).css("left",(left-distance)+"px");
	// 		//重绘流程元素
	// 		jsPlumb_instance.repaint(node);
	// 	}
	// }
	function moveAllNodes(xDistance, yDistance) {
		if (yDistance == null) {
			yDistance = 0;
		}
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var node = jsPlumb.getSelector('#' + jsPlumb_nodes[i]['id'])[0];
			var left = $('#' + jsPlumb_nodes[i]['id']).position().left;
			$(node).css("left", (left - xDistance) + "px");
			var top = $('#' + jsPlumb_nodes[i]['id']).position().top;
			$(node).css("top", (top - yDistance) + "px");
			//重绘流程元素
			jsPlumb_instance.repaint(node);
		}
	}

	/**
	 * @desc 界面初始化
	 */
	function initStartAndEnd() {
		var left = container_width / 2 - 30;

		//开始
		var startNodeParam = {};
		startNodeParam['x'] = '' + left + 'px';
		startNodeParam['y'] = '20px';
		startNodeParam['id'] = "flowchart_start_" + (new Date().getTime());
		startNodeParam['data-item'] = "flowchart_start_item";
		startNodeParam['text'] = "开 始";
		var startNode = initNode(startNodeParam);
		var startEndPoints = jsPlumb_instance.getEndpoints($(startNode));

		//loop开始
		var loopStartNodeParam = {};
		loopStartNodeParam['x'] = '' + left + 'px';
		loopStartNodeParam['y'] = '100px';
		loopStartNodeParam['id'] = "flowchart_loopStart_" + (new Date().getTime());
		loopStartNodeParam['data-item'] = "flowchart_loopStart_item";
		loopStartNodeParam['text'] = "loop开始";
		var loopStartNode = initNode(loopStartNodeParam);
		var loopStartEndPoints = jsPlumb_instance.getEndpoints($(loopStartNode));
		connectPortsBySt(startEndPoints[0], loopStartEndPoints[0]);

		//loop结束
		var loopEndNodeParam = {};
		loopEndNodeParam['x'] = '' + left + 'px';
		loopEndNodeParam['y'] = '180px';
		loopEndNodeParam['id'] = "flowchart_loopEnd_" + (new Date().getTime());
		loopEndNodeParam['data-item'] = "flowchart_loopEnd_item";
		loopEndNodeParam['text'] = "loop结束";
		var loopEndNode = initNode(loopEndNodeParam);
		var loopEndEndPoints = jsPlumb_instance.getEndpoints($(loopEndNode));
		connectPortsBySt(loopStartEndPoints[1], loopEndEndPoints[0]);
		connectPortsBySt(loopEndEndPoints[2], loopStartEndPoints[2]);

		//结束
		var endNodeParam = {};
		endNodeParam['x'] = '' + left + 'px';
		endNodeParam['y'] = '260px';
		endNodeParam['id'] = "flowchart_end_" + (new Date().getTime());
		endNodeParam['data-item'] = "flowchart_end_item";
		endNodeParam['text'] = "结 束";
		var endNode = initNode(endNodeParam);
		var endEndPoints = jsPlumb_instance.getEndpoints($(endNode));
		connectPortsBySt(loopEndEndPoints[1], endEndPoints[0]);
	}

	/**
	 * 为jsPlumb面板增加一个流程元素
	 * @param object param {id:"",data-item:"",text:"",x:"",y:""}的信息集
	 */
	function initNode(param) {
		var node = addNode(jsPlumb_container, param);
		jsPlumb_nodes.push(param);
		if (node === false) {
			return false;
		}
		addPorts(node);
		jsPlumb_instance.draggable($(node));

		//根据元素类型初始化连接
		addConnection(node);

		$(node).dblclick(function(ev) {

		}).click(function(e) {
			//为流程元素新增选中激活
			var divElement = $("#" + $(node).attr('id'));
			if (divElement.hasClass("flowchart-item-border-show")) {
				divElement.removeClass("flowchart-item-border-show");
				jsPlumb_selected_node = null;
				//eventcenter有事件则激活，没事件则不激活
				eventcenter.trigger("kenrobot", "flowchart_item_click", null);
			} else {

			}
		}).bind("mouseover", function(e) {
			var linkedEndPoints = jsPlumb_instance.getEndpoints($(node));
			$.each(linkedEndPoints, function(i, o) {
				// o.setPaintStyle({fillStyle:"1"})
			});
			showDesc(node, 1);
		}).on('mouseout', function(e) {
			showDesc(node, 2);
		});

		return node;
	}

	function showDesc(node, type) {
		var width = $(window).width();
		var height = $(window).height();

		if (type == 2) {
			$('.desc_show_' + $(node).attr('data-item')).hide(150, function(e) {
				$(this).remove();
			});
			return false;
		}

		var showText = '';
		var nowJsPlumbNodeAddInfo = getSelectedJsPlumbNode(node).node;
		showText += "图符说明：" + nowJsPlumbNodeAddInfo.text;

		if (showText.length === 0) {
			return false;
		}

		var div = $("<div></div>").html(showText).css({
			position: 'absolute',
			top: ((height - 60) + 'px'),
			left: '10px',
			width: ((width - 70) + "px"),
			height: '30px',
			border: '1px solid #6AB82E',
			backgroundColor: '#FFF',
			zIndex: 999,
			borderRadius: '5px',
			opacity: 0.7,
			filter: 'alpha(opacity=70)',
			padding: '10px 20px',
			fontSize: '20px'
		}).addClass('desc_show_' + $(node).attr('data-item')).hide();
		$('body').append(div);
		div.show(150);
	}


	/**
	 * @desc 根据指定元素和配置，初始化连接
	 * @param Object node 流程元素
	 */
	function addConnection(node) {
		var nodeType = getNodeInfoByKey($(node).attr("data-item"), "type");
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
		} else if (nodeType == "tjfz") {
			var a = 0;
		}
	}

	/**
	 * 新增一个流程元素
	 * @param string parentId 整个流程图绘制版DIV的id
	 * @param object param {id:"",data-item:"",text:"",x:"",y:""}的信息集
	 */
	function addNode(parentId, param) {
		var objSet = fis[param['data-item']];
		var panel = d3.select("#" + parentId);

		if (objSet.unique && $("div[data-item='" + param['data-item'] + "']", $("#" + parentId)).length > 0) {
			alert("指定流程元素在流程中只能使用一次");
			return false;
		}
		var showText = param['text'];
		if (getNodeInfoByKey(param['data-item'], 'textHide')) {
			showText = "";
		}
		panel.append('div')
			.style('position', 'absolute')
			.style('top', param['y'])
			.style('left', param['x'])
			.attr('align', 'center')
			.attr('id', param['id'])
			.attr('data-item', param['data-item'])
			.classed(objSet.className, true)
			.classed('node', true)
			.classed(jsPlumb_container + '-item', true)
			.text(showText);
		return jsPlumb.getSelector('#' + param['id'])[0];
	}

	/**
	 * 根据配置为流程增加endpoint
	 * @param element node 一个流程元素
	 */
	function addPorts(node) {
		if (node == null) {
			return false;
		}
		//Assume horizental layout
		var arrAnchor = fis[$(node).attr('data-item')].points;
		for (var i = 0; i < arrAnchor.length; i++) {
			var tmpUuid = node.getAttribute("id") + "_" + arrAnchor[i].position;
			var endPoint = jsPlumb_instance.addEndpoint(node, {
				uuid: tmpUuid,
				paintStyle: {
					radius: 3,
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

	/**
	 * 初始化整个画板，同时增加双击链接取消链接功能
	 */
	function initJsPlumbInstance() {
		var color = "#E8C870";
		jsPlumb_instance = jsPlumb.getInstance({
			Connector: ["Flowchart", {
				gap: 3,
				curviness: 50,
				midpoint: 1,
				stub: 20,
				alwaysRespectStubs: true
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
					location: -5
				}]
			],
			Container: jsPlumb_container,
			connectorStyle: {
				outlineWidth: 2,
				outlineColor: "WHITE"
			}
		});
		jsPlumb_instance.bind("dblclick", function(conn, e) {
			// jsPlumb_instance.detach(conn);
		});
	}

	/**
	 * 初始化拖拽功能
	 * @param event e 鼠标拖拽实践
	 */
	function initDrag(e) {
		try {
			e.originalEvent.dataTransfer.setData('text', e.target.id);
			e.originalEvent.dataTransfer.setData('offsetX', e.originalEvent.offsetX);
			e.originalEvent.dataTransfer.setData('offsetY', e.originalEvent.offsetY);
		} catch (ev) {
			data_transfer['text'] = e.target.id;
			data_transfer['offsetX'] = e.originalEvent.offsetX;
			data_transfer['offsetY'] = e.originalEvent.offsetY;
		}
	}

	/**
	 * 完成元素拖拽后的处理
	 * @param event e 鼠标拖拽实践
	 */
	function finishDrag(e) {
		//拖拽对象不是连接点的时候
		if (e.target.closest("div").className.indexOf('_jsPlumb') < 0 || e.target.closest("div").className.indexOf(jsPlumb_container + '-item') < 0) {
			return false;
		}
		e.preventDefault();
		//生成流程图元素的样式、位置
		var flowchart_obj_param = {};
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
		flowchart_obj_param['x'] = '' + x + 'px';
		flowchart_obj_param['y'] = '' + y + 'px';

		flowchart_obj_param['id'] = objId + "_" + (new Date().getTime());
		flowchart_obj_param['data-item'] = $("#" + objId).attr('data-item');
		flowchart_obj_param['text'] = $("#" + objId).text();
		if (flowchart_obj_param['text'].length == 0) {
			flowchart_obj_param['text'] = $("#" + objId).parent().text();
		}

		if (flowchart_obj_param['data-item'] == "flowchart_tjfz_item") {
			var mergeNodeParam = {};
			mergeNodeParam['id'] = "flowchart_tjfzMerge_" + (new Date().getTime());
			mergeNodeParam['x'] = flowchart_obj_param['x'];
			mergeNodeParam['y'] = flowchart_obj_param['y'];
			mergeNodeParam['text'] = "分支合并";
			mergeNodeParam['data-item'] = "flowchart_tjfzMerge_item";

			var mergeNode = initNode(mergeNodeParam);
			var mergeNodeEndPoints = jsPlumb_instance.getEndpoints($(mergeNode));
			//若拖拽进入已有元素，则自动连接
			initConnection(mergeNode, e.target, x, y);
		}
		var node = initNode(flowchart_obj_param);

		//若拖拽进入已有元素，则自动连接
		initConnection(node, e.target, x, y);

		try {
			e.originalEvent.dataTransfer.clearData();
		} catch (ev) {
			data_transfer = {};
		}

		genC.refresh();
	}

	/**
	 * @desc拖拽至元素时自动绘制图形位置，需将已有下属元素进行位置调整
	 * @param node 流程元素
	 * @param event e 事件
	 * @param float centerX 实际中心点当前位置
	 * @param float centerY 实际中心点当前位置
	 */
	function initConnection(node, target, centerX, centerY) {
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
		var sourceFis = fis[$(sourceEndPoint.getElement()).attr("data-item")];
		//根据最近的起始连接点重定位新流程元素位置
		var objX = 0;
		var objY = 0;

		var relativeDistance = getLeftTopToSourceEndpointDistance(node);

		baseX = baseX + $(targetDiv).outerWidth() / 2 - $(node).outerWidth() / 2;
		switch (sourceEndPoint.anchor.type) {
			case "TopCenter":
				objX = baseX;
				objY = baseY - $(targetDiv).outerHeight() - 20;
				break;
			case "RightMiddle":
				objX = baseX + $(node).outerWidth() + 20;
				// objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 20;
				break;
			case "BottomCenter":
				objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 30;
				break;
			case "LeftMiddle":
				// objX = baseX - $(node).outerWidth() - 20;
				objX = baseX;
				objY = baseY + $(targetDiv).outerHeight() + 20;
				break;
			default:
				break;
		}

		$(node).css("top", objY).css("left", objX);
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
		var nodeType = getNodeInfoByKey($(sourceEndPoint.getElement()).attr("data-item"), "type");

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
			var targetType = getNodeInfoByKey($(connections[i].target).attr("data-item"), "type");
			var sourceType = getNodeInfoByKey($(connections[i].source).attr("data-item"), "type");
			var nodeType = getNodeInfoByKey($(node).attr("data-item"), "type");
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
				}
				$(connections[i].target).css("top", positionY);
			}
			//重绘流程元素
			jsPlumb_instance.repaint(connections[i].target);
			arguments.callee(connections[i].endpoints[1], node, fixedSourceEndPoint, mode);
		}
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
	 * @desc 截断需截断连接，重新连接
	 * @param EndPoint sourceEndPoint 起始点
	 * @param Node node 新绘制元素
	 */
	function cutAndLink(sourceEndPoint, node) {
		//在新的元素上获取打断重连的起点
		var arrSourceTargetEndPoint = [];
		var sourceEndPoints = jsPlumb_instance.getEndpoints($(node));

		var tmpObjType = getNodeInfoByKey($(node).attr("data-item"), "type");
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
	 * @desc 获取指定起点下的所有元素
	 * @param Endpoint tmpEndpoint 指定的起点元素
	 */
	function getMoreNodesEndpoint(tmpEndpoint) {
		var connectionObj = {};
		getAllLevelInfoFromOneStart(tmpEndpoint, connectionObj, 0, tmpEndpoint);
		return connectionObj;
	}

	/**
	 * @desc 递归获取指定起点元素的所有流程元素
	 * @param Endpoint sourceEndPoint 递归的流程元素
	 * @param json objInfos 用来存储流程元素的json对象
	 * @param int startLevel 从startEndPoint开始的层级
	 * @param Endpoint startEndPoint 最初的起点元素
	 */
	function getAllLevelInfoFromOneStart(sourceEndPoint, objInfos, startLevel, startEndPoint) {
		// console.log(sourceEndPoint);
		var keyId = $(sourceEndPoint.getElement()).attr("id");
		if (sourceEndPoint.getUuid() != startEndPoint.getUuid()) {
			objInfos[keyId] = getSuitableLevel(objInfos, keyId, startLevel);
		} else {
			if (objInfos[keyId] == null || objInfos[keyId] == undefined) {
				objInfos[keyId] = startLevel;
			}
		}

		var conns = jsPlumb_instance.getConnections({
			source: $(sourceEndPoint.getElement())
		});

		for (var i = 0; i < conns.length; i++) {
			if (conns[i].endpoints[0].getUuid() != sourceEndPoint.getUuid()) continue;
			if (conns[i].targetId == keyId) continue;
			var targetEndPoint = conns[i].endpoints[1];
			if (conns[i].targetId != $(targetEndPoint.getElement()).attr("id")) targetEndPoint = conns[i].endpoints[0];

			var targetKeyId = $(targetEndPoint.getElement()).attr("id");
			objInfos[targetKeyId] = getSuitableLevel(objInfos, targetKeyId, startLevel + 1);

			var targetEndPoints = jsPlumb_instance.getEndpoints(targetEndPoint.getElement());
			for (var j = 0; j < targetEndPoints.length; j++) {
				if (targetEndPoints[j].isSource) {
					getAllLevelInfoFromOneStart(targetEndPoints[j], objInfos, startLevel + 1, startEndPoint);
				}
			}
		}
	}

	/**
	 * @desc jsonObj中指定id的leve值和level进行对比，获取相对比较小的层级信息
	 * @param json jsonObj
	 * @param string id
	 * @param int level
	 */
	function getSuitableLevel(jsonObj, id, level) {
		if (jsonObj[id] && jsonObj[id] != null && jsonObj[id] != undefined) {
			if (jsonObj[id] >= level) {
				return jsonObj[id];
			} else {
				return level;
			}
		} else {
			return level;
		}
	}

	/**
	 * @desc 通过制定的data_item信息获取flowchart_item_set中的kind信息，即流程元素所属
	 * @param string data_item
	 * @param string key
	 */
	function getNodeInfoByKey(data_item, key) {
		var objSet = fis[data_item];
		if (objSet && objSet[key] && objSet[key] != undefined) {
			return objSet[key];
		}
		return false;
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

	/**
	 * 获取整个流程图的链接信息
	 */
	function getConnections() {
		$.each(jsPlumb_instance.getAllConnections(), function(id, connection) {
			console.log(connection);
			// $.each(scopeConnections, function(i, el) {
			// 	locations.push($.extend(el.source.offset(), { nodeId: el.source.data("id") }));
			// 	locations.push($.extend(el.target.offset(), { nodeId: el.target.data("id") }));
			// 	connections.push({ source: el.source.data("id"), target: el.target.data("id") });
			// });
		});
		console.log(JSON.stringify(connections));
	};

	/**
	 * 获取整个流程图信息
	 */
	function getFlowchart() {
		var arrFlowchart = [];
		$.each(jsPlumb_instance.getConnections(), function(id, connection) {
			arrFlowchart.push({
				"source": connection.sourceId,
				"target": connection.targetId
			})
		});
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
			jsPlumb_nodes[i]['x'] = "" + $("#" + jsPlumb_nodes[i]['id']).position().left + "px";
			jsPlumb_nodes[i]['y'] = "" + $("#" + jsPlumb_nodes[i]['id']).position().top + "px";
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

	/**
	 * @return function init 初始化流程图绘制工具
	 * @return function getConnections 获取连接信息
	 * @return function getFlowchart 获取流程图信息
	 * @return function getFlowchartElements 获取流程图元素集
	 * @return function clear 清空整个流程图面板
	 * @return function draw 根据给定元素绘制流程图
	 * @return funxtion setSelectedNodeInfo 为选中的流程元素添加附加信息
	 * @hiden event 隐藏激活"kenrobot","flowchart_item_click"绑定的eventcenter事件
	 */
	return {
		init: init,
		initDraggable: initDraggable,
		getConnections: getConnections,
		getFlowchart: getFlowchart,
		getFlowchartElements: getFlowchartElements,
		clear: clear,
		draw: draw,
		isEmpty: isEmpty,
		setSelectedNodeInfo: setSelectedNodeInfo,
		getNodeInfoByKey: getNodeInfoByKey,
		setShowGuid: setShowGuid
	}
});