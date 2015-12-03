define(["jquery", "jsplumb", "eventcenter", "jquery-ui"], function($, jsPlumb, eventcenter) {
	var jsPlumb_container;
	var itemClass;
	var jsPlumb_instance;
	var jsPlumb_nodes = [];

	var container_width = 0;
	var container_height = 0;

	var dragging_left = 0;
	var dragging_top = 0;

	var data_transfer = {};

	// 拖拽时临时产生的提示连接点
	var linkableEndpoints = [];
	// 可能使用的端口、位信息
	var linkablePortBits = {};

	var initCloseEndpoint = null;

	// 放大缩小
	var zoomLevel = 0;
	var zoom = 1;
	var configs;

	/**
	 * 整个处理的入口，需要初始化
	 * @param string strContainer 用来绘制流程图的DIV
	 * @param string itemClass 可以拖拽的元素
	 */
	function init(itemCls, strContainer, hardwares) {
		jsPlumb_container = strContainer;
		itemClass = itemCls;
		configs = hardwares;

		jsPlumb.ready(onReady);
		$(window).resize(onWindowResize);
		// $('#' + jsPlumb_container).mousewheel(onMouseWheel);
		$('#' + jsPlumb_container).mousedown(onMouseDown);
		$.contextMenu({
			selector: "." + jsPlumb_container + "-item",
			callback: function(key, options) {
				switch (key) {
					case 'delete':
						var node = jsPlumb.getSelector('#' + $(this).attr('id'))[0];
						deleteNodeByElement(node);
						break;
				}
			},
			items: {
				"delete": {
					name: "Delete",
					icon: "delete"
				},
			}
		});
	}

	function onReady() {
		container_width = $('#' + jsPlumb_container).width();
		container_height = $('#' + jsPlumb_container).height();

		initJsPlumbInstance();

		$('div.' + itemClass).parent().on('dragstart', function(ev) {
			initDrag(ev);
		}).on('touchstart', function(ev) {
			initDrag(ev);
		}).on('dragend', function(ev) {
			// 恢复连接点默认色
			for (var i = 0; i < linkableEndpoints.length; i++) {
				linkableEndpoints[i].setPaintStyle({
					fillStyle: '#333'
				});
			}
			linkableEndpoints = [];
			linkablePortBits = {};
		}).on('drag', function(ev) {
			// 对象拖拽移动事件
			setRelativeMovingPosition(ev);
		});

		$('#' + jsPlumb_container).on('drop', function(ev) {
			finishDrag(ev);
		}).on('dragover', function(ev) {
			ev.preventDefault();
		});

		jsPlumb.fire("jsFlowLoaded", jsPlumb_instance);

		initMainBoard();
	}

	function onWindowResize(e) {
		var canvas = $('#' + jsPlumb_container);
		var width = canvas.width();
		var height = canvas.height();
		var offsetX = (width - container_width) / 2;
		var offsetY = (height - container_height) / 2;
		container_width = width;
		container_height = height;

		moveAllNodes(offsetX, offsetY);
	}

	function onMouseDown(e) {
		if($(e.target).attr('id') != jsPlumb_container) {
			return false;
		}

		var startX = e.pageX;
		var startY = e.pageY;
		var isMoving = true;
		var canvas = $('#' + jsPlumb_container);
		canvas.css({
			cursor: 'move'
		});
		$(document).bind({
			mouseup: function(e) {
				isMoving = false;
				canvas.css({
					cursor: 'auto'
				});
			},
			mouseout: function(e) {
				isMoving = false;
				canvas.css({
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

	function onMouseWheel(e, delta, x, y) {
		if (delta > 0 && zoomLevel < 20) {
			zoomLevel++;
		} else if (delta < 0 && zoomLevel > -20) {
			zoomLevel--;
		}

		var newZoom = 1;
		if (zoomLevel > 0) {
			newZoom = 1 + 0.2 * zoomLevel;
		} else if (zoomLevel < 0) {
			newZoom = 1 - 0.04 * Math.abs(zoomLevel);
		}
		if (newZoom == zoom) {
			return;
		}
		zoom = newZoom;

		var offset = $('#' + jsPlumb_container).offset();
		var mouseX = e.pageX - offset.left;
		var mouseY = e.pageY - offset.top;
		// console.log("zoom " + zoom + " level " + zoomLevel + " mouse: " + mouseX + ", " + mouseY);

		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var nodeInfo = jsPlumb_nodes[i];
			var node = jsPlumb.getSelector('#' + nodeInfo.id)[0];
			var oldX = $(node).position().left;
			var oldY = $(node).position().top;
			var newX = Math.round((nodeInfo.x - mouseX) * zoom + mouseX);
			var newY = Math.round((nodeInfo.y - mouseY) * zoom + mouseY);
			var newWidth = Math.round(nodeInfo.width * zoom);
			var newHeight = Math.round(nodeInfo.height * zoom);
			$(node).css({
				left: newX,
				top: newY,
				width: newWidth,
				height: newHeight,
			});
			// console.log("zoom " + zoom + " level " + zoomLevel + " mouse: " + mouseX + ", " + mouseY + " pos: " + oldX + ", " + oldY + " -> " + newX + ", " + newY);
			jsPlumb_instance.repaint(node);
		}
	}

	function initJsPlumbInstance() {
		var color = "#333";
		jsPlumb_instance = jsPlumb.getInstance({
			Connector: ["Flowchart", {
				cornerRadius: 5,
				// alwaysRespectStubs: true
			}],
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
			Container: jsPlumb_container
		});

		jsPlumb_instance.setZoom(1);
	}

	function initMainBoard() {
		var dataItem = "hardware_board_item";
		var left = container_width / 2 - 150;
		var top = container_height / 2 - 92;
		var param = {
			x: left,
			y: top,
			id: "hardware_board_" + (new Date().getTime()),
			'data-item': dataItem,
			text: "主板",
			port: "",
			add_info: "",
		};

		initNode(param);

		var config = getConfig(dataItem);
		eventcenter.delaytrigger('hardware', 'finish_drag', {
			id: param.id,
			type: config.type,
			name: config.name,
			text: param.text,
			left: left,
			top: top,
		});
	}

	function initNode(param) {
		var type = param['data-item'];
		var config = getConfig(type);
		var canvas = $("#" + jsPlumb_container);
		if (config.unique && $("div[data-item='" + type + "']", canvas).length > 0) {
			alert("指定硬件元件在流程中只能使用一次");
			return false;
		}

		$('<div>').appendTo(canvas)
			.css({
				position: 'absolute',
				left: param.x,
				top: param.y,
			})
			.attr('align', 'center')
			.attr('id', param.id)
			.attr('data-item', type)
			.addClass(config.className)
			.addClass('node')
			.addClass(jsPlumb_container + '-item');

		var node = jsPlumb.getSelector('#' + param.id)[0];
		param.width = $(node).width();
		param.height = $(node).height();
		$(node).css({
			width: Math.round($(node).width() * zoom),
			height: Math.round($(node).height() * zoom)
		});

		var tmpAddInfo = {};
		if (param['add_info']) {
			tmpAddInfo = param['add_info'];
		} else {
			for (var key in config) {
				tmpAddInfo[key] = config[key];
			}
		}
		param.add_info = tmpAddInfo;
		jsPlumb_nodes.push(param);

		var arrAnchor = getConfig($(node).attr('data-item')).points;
		for (var i = 0; i < arrAnchor.length; i++) {
			var uuid = node.getAttribute("id") + "_" + arrAnchor[i].position;
			var paintStyle = {
				radius: 5,
				fillStyle: arrAnchor[i].color
			};
			jsPlumb_instance.addEndpoint(node, {
				endpoint: arrAnchor[i].shape,
				uuid: uuid,
				paintStyle: paintStyle,
				anchor: arrAnchor[i].position,
				maxConnections: -1,
				isSource: arrAnchor[i].source,
				isTarget: arrAnchor[i].target,
				//连线不能被手动删除
				connectionsDetachable: false,
			});
		}

		jsPlumb_instance.draggable($(node), {
			stop: function(e, ui) {
				param.x = Math.round($(node).position().left);
				param.y = Math.round($(node).position().top);
			}
		});

		$(node).on('dragover', function(e) {
			onDragoverEvent(e, this);
		}).on('mouseover', function(e) {
			showDesc(node, true);
		}).on('mouseout', function(e) {
			showDesc(node, false);
		});

		return node;
	}

	function initDrag(e) {
		data_transfer.id = e.target.id;
		data_transfer.offsetX = e.originalEvent.offsetX;
		data_transfer.offsetY = e.originalEvent.offsetY;

		var nodeType = $(e.target).attr("data-item");
		getAndInitLinkEndpoint(nodeType);
	}

	function finishDrag(e) {
		// 如果无可连接点，则返回
		if (linkableEndpoints == null || linkableEndpoints.length == 0) {
			return false;
		};

		//拖拽对象不是连接目标的时候
		var targetDiv = $(e.target);

		if (targetDiv.closest("div").attr('class').indexOf('_jsPlumb') < 0 || targetDiv.closest("div").attr('class').indexOf(jsPlumb_container + '-item') < 0) {
			return false;
		}
		e.preventDefault();

		//生成流程图元素的样式、位置
		var nodeX = Math.round(e.originalEvent.offsetX - data_transfer.offsetX);
		var nodeY = Math.round(e.originalEvent.offsetY - data_transfer.offsetY);

		var id = data_transfer.id;
		var target = $("#" + id);
		var param = {
			x: nodeX,
			y: nodeY,
			id: id + "_" + (new Date().getTime()),
			text: target.text() || target.parent().text(),
			'data-item': target.attr('data-item'),
		};

		var node = initNode(param);
		var nodeFis = getConfig(param['data-item']);
		var nodePort = '';
		var targetJsPlumbNode = null;

		// 若拖拽进入已有元素，则自动连接，并调整元素位置
		if (targetDiv.closest("div").attr('class').indexOf('_jsPlumb') >= 0) {
			var sourceFis = getConfig($(targetDiv.closest("div")).attr("data-item"));
			for (var i = 0; i < jsPlumb_nodes.length; i++) {
				if (jsPlumb_nodes[i]['id'] === $(targetDiv.closest("div")).attr('id')) {
					targetJsPlumbNode = jsPlumb_nodes[i];
					sourceFis = jsPlumb_nodes[i]['add_info'];
				}
			}

			var sEndpoint = initCloseEndpoint;
			if (sEndpoint == null) {
				sEndpoint = getNearestEndPointFromNode(targetDiv, node, nodeX, nodeY);
			}

			// 确认该点的端口
			var sEndpointX = sEndpoint.anchor.x;
			var sEndpointY = sEndpoint.anchor.y;
			var sourceFisPoints = sourceFis['points'];
			for (var i = 0; i < sourceFisPoints.length; i++) {
				if (sEndpointX == sourceFisPoints[i].position[0] && sEndpointY == sourceFisPoints[i].position[1] && sEndpoint.isSource == sourceFisPoints[i].source && sEndpoint.isTarget == sourceFisPoints[i].target) {
					nodePort = sourceFisPoints[i].port;
					break;
				}
			}

			var userInitFlag = true;
			//连接点在硬件主板上，且连接元素室LED灯时，需要确认转接口的存在
			if (sourceFis.type == 'board') {
				var hasAdapter = false;
				var conns = jsPlumb_instance.getConnections({
					source: targetDiv.closest("div")
				});
				if (nodeFis.needPinboard) {
					//确认是否在该点上有链接的转接口
					for (var i = 0; i < conns.length; i++) {
						if (conns[i].endpoints[0].getUuid() != sEndpoint.getUuid()) continue;

						for (var j = 0; j < conns[i].endpoints.length; j++) {
							var tmpEndpoint = conns[i].endpoints[1];
							var tmpNodeFis = getConfig($(tmpEndpoint.getElement()).attr("data-item"));
							if (tmpNodeFis.type == "adapter") {
								hasAdapter = true;
								targetDiv = $(tmpEndpoint.getElement());
								break;
							}
						}
					}
					if (!hasAdapter) {
						var adapterParam = {
							x: param.x,
							y: param.y,
							id: "hardware_adapter_" + (new Date().getTime()),
							text: "转接口",
							'data-item': "hardware_adapter_item",
						};
						var adapterNode = initNode(adapterParam);
						initConnection(
							adapterNode,
							targetDiv,
							nodeX,
							nodeY
						);
						targetDiv = $(adapterNode);
					}
					userInitFlag = false;
				}
			}

			initConnection(
				node,
				targetDiv,
				nodeX,
				nodeY,
				userInitFlag
			);
		}

		var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
		if (tmpJsPlumbNode.index > -1) {
			var tmpNode = tmpJsPlumbNode.node;
			var tmpIndex = tmpJsPlumbNode.index;
			var usedPortBit = getConnectedBit(targetJsPlumbNode, nodePort, tmpNode);

			tmpNode['add_info']['port'] = nodePort;
			tmpNode['add_info']['usedPortBit'] = usedPortBit;

			jsPlumb_nodes.splice(tmpIndex, 1, tmpNode);
			var data = {
				id: tmpNode['id'],
				type: nodeFis.type,
				port: usedPortBit,
				add_info: tmpNode['add_info'],
				text: tmpNode['text'],
				left: $(node).position().left,
				top: $(node).position().top
			}
			for (var i in nodeFis) {
				if (i == 'port' || i == 'usedPortBit' || i == 'rotate') {
					continue;
				}
				data[i] = nodeFis[i];
			}
			eventcenter.trigger('hardware', 'finish_drag', data);
		}

		data_transfer = {};

		initCloseEndpoint = null;

		//将每个元素的位置信息进行一次处理，为放大缩小进行位置信息整理准备
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var nodeInfo = jsPlumb_nodes[i];
			nodeInfo.x = $(jsPlumb.getSelector('#' + nodeInfo.id)).position().left;
			nodeInfo.y = $(jsPlumb.getSelector('#' + nodeInfo.id)).position().top;
		}
	}

	function initConnection(node, target, centerX, centerY, flag) {
		var targetDiv = target.closest("div");

		var nodeConfig = getConfig($(node).attr('data-item'));
		var nodeName = nodeConfig.name;

		var sourceEndPoint = null;
		if (flag) {
			sourceEndPoint = initCloseEndpoint;
		}
		if (sourceEndPoint == null) {
			sourceEndPoint = getNearestEndPointFromNode(targetDiv, node, centerX, centerY);
		}
		if (sourceEndPoint == null) {
			jsPlumb_instance.remove($(node));
			return false;
		}

		//拖拽位置所指对象的位置
		var baseX = $(targetDiv).position().left;
		var baseY = $(targetDiv).position().top;

		//获取起始连接点的属性
		var sourceFis = getConfig($(targetDiv).attr("data-item"));
		//根据最近的起始连接点重定位新流程元素位置
		var objX = 0;
		var objY = 0;

		var baseX = $(sourceEndPoint.canvas).position().left + $(sourceEndPoint.canvas).width() / 2 - $(node).width() / 2;
		var baseY = $(sourceEndPoint.canvas).position().top;
		if (sourceFis.type == "board") {
			objX = baseX;
			//主板连接点定制
			if (sourceEndPoint.anchor.y > 0.5) {
				$(node).addClass("content-rotate");
				var targetEndPoints = jsPlumb_instance.getEndpoints($(node));
				for (var i = 0; i < targetEndPoints.length; i++) {
					targetEndPoints[i].anchor.x = 1 - targetEndPoints[i].anchor.x;
					targetEndPoints[i].anchor.y = 1 - targetEndPoints[i].anchor.y;
				}
				var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
				if (tmpJsPlumbNode.index > -1) {
					tmpJsPlumbNode.node['add_info']['rotate'] = 1;
					jsPlumb_nodes.splice(tmpJsPlumbNode.index, 1, tmpJsPlumbNode.node);
				}
				//主板下连接点
				if (nodeName == 'adapter') {
					objY = baseY + 30;
				} else {
					objY = baseY + 40;
				}
			} else {
				//主板上连接点
				if (nodeName == 'adapter') {
					objY = baseY - $(node).outerHeight();
				} else {
					objY = baseY - $(node).outerHeight() - 30;
				}
			}
		} else {
			if ($(targetDiv).hasClass("content-rotate")) {
				//父点旋转，子点也旋转
				objX = baseX;
				objY = baseY + 30;
				$(node).addClass("content-rotate");
				var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
				if (tmpJsPlumbNode.index > -1) {
					tmpJsPlumbNode.node['add_info']['rotate'] = 1;
					jsPlumb_nodes.splice(tmpJsPlumbNode.index, 1, tmpJsPlumbNode.node);
				}

				var targetEndPoints = jsPlumb_instance.getEndpoints($(node));
				for (var i = 0; i < targetEndPoints.length; i++) {
					targetEndPoints[i].anchor.x = 1 - targetEndPoints[i].anchor.x;
					targetEndPoints[i].anchor.y = 1 - targetEndPoints[i].anchor.y;
				}
			} else {
				objX = baseX;
				objY = baseY - $(node).outerHeight() - 30;
			}
			var arrConn = jsPlumb_instance.getConnections({
				source: sourceEndPoint.getElement()
			});
			//将同一节点出来的元素拆分显示
			if (arrConn.length % 2 == 0) {
				objX = objX - ($(node).outerWidth() + 10) * arrConn.length / 2;
			} else if (arrConn.length == 1) {
				objX = objX + $(node).outerWidth() + 10;
			} else if (arrConn.length % 2 == 1) {
				objX = objX + ($(node).outerWidth() + 10) * (arrConn.length - arrConn.length % 2 + 2) / 2;
			}
		}

		$(node).css({
			top: objY,
			left: objX
		});
		//重绘流程元素
		jsPlumb_instance.repaint(node);

		var targetEndPoints = jsPlumb_instance.getEndpoints($(node));

		var targetEndPoint = null;
		for (var i = 0; i < targetEndPoints.length; i++) {
			if (targetEndPoints[i].isTarget) {
				targetEndPoint = targetEndPoints[i];
				break;
			}
		}

		jsPlumb_instance.connect({
			source: sourceEndPoint,
			target: targetEndPoint
		});
	}

	function getNearestEndPointFromNode(div, node, centerX, centerY) {
		var realX = $(node).outerWidth() / 2 + centerX;
		var realY = $(node).outerHeight() / 2 + centerY;

		var sourceEndPoint = null;

		//拖拽位置所指对象的位置
		var baseX = $(div).position().left;
		var baseY = $(div).position().top;

		//获取拖拽位置所指对象的所有连接点endpoint
		var sourceEndPoints = jsPlumb_instance.getEndpoints(div);

		var nodeConfig = getConfig($(div).attr('data-item'));
		//根据拖拽放置情况获取离当前元素最近的连接点
		var distance = 0;
		for (var i = 0; i < sourceEndPoints.length; i++) {
			var endpoint = sourceEndPoints[i];
			if (endpoint.isSource && (nodeConfig.type != "board" || linkableEndpoints.length == 0 || linkableEndpoints.indexOf(endpoint) >= 0)) {
				var offsetX = $(endpoint.canvas).position().left - baseX - realX;
				var offsetY = $(endpoint.canvas).position().top - baseY - realY;
				if (distance == 0) {
					distance = offsetX * offsetX + offsetY * offsetY;
					sourceEndPoint = sourceEndPoints[i];
				} else {
					var tmpDistance = offsetX * offsetX + offsetY * offsetY;;
					if (distance > tmpDistance) {
						distance = tmpDistance;
						sourceEndPoint = sourceEndPoints[i];
					}
				}
			}
		}
		return sourceEndPoint;
	}

	function cutAndLink(sourceEndPoint, node) {
		//在新的元素上获取打断重连的起点
		var sourceTargetEndPoint = null;
		var sourceEndPoints = jsPlumb_instance.getEndpoints($(node));
		for (var i = 0; i < sourceEndPoints.length; i++) {
			if (!sourceEndPoints[i].isSource) continue;
			sourceTargetEndPoint = sourceEndPoints[i];
			break;
		}
		var connections = jsPlumb_instance.getConnections({
			source: sourceEndPoint.getElement()
		});
		for (var i = 0; i < connections.length; i++) {
			if (sourceEndPoint.getUuid() != connections[i].endpoints[0].getUuid()) continue;
			if ($(node).attr('id') == connections[i].targetId || $(node).attr('id') == connections[i].sourceId) {
				continue;
			}
			jsPlumb_instance.detach(connections[i]);
			jsPlumb_instance.connect({
				source: sourceTargetEndPoint,
				target: connections[i].endpoints[1]
			});
		}
	}

	function moveAllNodes(offsetX, offsetY) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		if (offsetX == 0 && offsetY == 0) {
			return;
		}

		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var nodeInfo = jsPlumb_nodes[i];
			var node = jsPlumb.getSelector('#' + nodeInfo.id);
			var pos = $(node).position();
			$(node).css({
				left: Math.round(pos.left + offsetX),
				top: Math.round(pos.top + offsetY),
			});
			nodeInfo.x = Math.round($(node).position().left);
			nodeInfo.y = Math.round($(node).position().top);

			//重绘流程元素
			jsPlumb_instance.repaint(node);
		}
	}

	function setRelativeMovingPosition(ev) {
		// 获取相对元素内的相对移动位置
		dragging_left = ev.originalEvent.x;
		dragging_top = ev.originalEvent.y;
	}

	function onDragoverEvent(e, obj) {
		var nowJsPlumbNodeAddInfo = getSelectedJsPlumbNodeByObj($(obj)).node.add_info;
		if (nowJsPlumbNodeAddInfo.type != "board") {
			return false;
		}

		var mousemoveX = Math.round(dragging_left);
		var mousemoveY = Math.round(dragging_top);

		var closeEndpoint = null;
		var closeDistance = 0;
		for (var i = 0; i < linkableEndpoints.length; i++) {
			linkableEndpoints[i].setPaintStyle({
				fillStyle: '#0FF'
			});
			var tmpX = Math.round($(linkableEndpoints[i].canvas).offset().left) - mousemoveX;
			var tmpY = Math.round($(linkableEndpoints[i].canvas).offset().top) - mousemoveY;
			if (closeEndpoint == null) {
				closeEndpoint = linkableEndpoints[i];
				closeDistance = tmpX * tmpX + tmpY * tmpY;
			} else {
				tmpDistance = tmpX * tmpX + tmpY * tmpY;
				if (tmpDistance < closeDistance) {
					closeDistance = tmpDistance;
					closeEndpoint = linkableEndpoints[i];
				}
			}
		}

		if (closeEndpoint != null) {
			closeEndpoint.setPaintStyle({
				fillStyle: '#F00'
			});
			initCloseEndpoint = closeEndpoint;
		}
	}

	function showDesc(node, show) {
		var nodeType = $(node).attr('data-item');

		if (!show) {
			$('.desc_show_' + nodeType).hide(150, function(e) {
				$(this).remove();
			});
			return false;
		}

		if (nodeType == "hardware_board_item") {
			return false;
		}

		var width = $(window).width();
		var height = $(window).height();
		var showText = '';
		var addInfo = getSelectedJsPlumbNode(node).node.add_info;

		if (addInfo.category && addInfo.category != undefined) {
			showText += addInfo.category;
		}
		if (addInfo.name_cn && addInfo.name_cn != undefined) {
			showText += '：' + addInfo.name_cn;
		}
		if (showText.length === 0) {
			return false;
		}
		if (addInfo.type == "board") {
			showText += '；可用端口信息：';
			for (var i = 0; i < addInfo.points.length; i++) {
				showText += ' <span style="font-size:12px;">' + (addInfo.points)[i].port + ":" + (addInfo.points)[i].bit + '</span>';
			}
		} else {
			showText += '；使用端口位：' + addInfo.usedPortBit;
			if (addInfo.func && addInfo.func != undefined) {
				showText += '；函数：' + addInfo.func;
			}
		}
		if (showText.length === 0) {
			return false;
		}

		var div = $("<div></div>").html(showText).css({
			position: 'absolute',
			top: height - 60,
			left: 10,
			width: width - 70,
			height: 30,
			border: '1px solid #6AB82E',
			backgroundColor: '#FFF',
			zIndex: 999,
			borderRadius: 5,
			opacity: 0.7,
			filter: 'alpha(opacity=70)',
			padding: '10px 20px',
			fontSize: '20px'
		}).addClass('desc_show_' + $(node).attr('data-item')).appendTo('body').hide().show(150);
	}

	// 根据html元素删除节点对象
	function deleteNodeByElement(node) {
		var config = getConfig($(node).attr("data-item"));
		if (config.always) {
			alert("不可删除元素！");
			return false;
		}
		var parentNodes = [];
		$.each(jsPlumb_instance.getConnections({
			target: $(node)
		}), function(i, o) {
			if (o.targetId != o.sourceId) {
				parentNodes.push(o.source);
			}
		});

		// 存在分支元素时节点元素不能删除
		var childrenEndpoints = [];
		$.each(jsPlumb_instance.getConnections({
			source: $(node)
		}), function(i, o) {
			if (o.targetId != o.sourceId) {
				childrenEndpoints.push(o.endpoints[1]);
			}
		});
		if (childrenEndpoints.length > 0) {
			alert("存在关联连接，无法删除！");
			return false;
		}
		jsPlumb_instance.remove(node);

		var mainboard = null;
		var mainboardIndex = 0;

		var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
		var adpterExistFlag = false;
		if (tmpJsPlumbNode.index > -1) {
			var tmpNode = tmpJsPlumbNode.node;
			var tmpIndex = tmpJsPlumbNode.index;

			eventcenter.trigger('hardware', 'finish_remove', {
				"id": tmpNode['id']
			});

			if (tmpNode['add_info']['usedPortBit'] && tmpNode['add_info']['usedPortBit'].length > 0) {
				var usedPortBit = tmpNode['add_info']['usedPortBit'];
				for (var j = 0; j < jsPlumb_nodes.length; j++) {
					if (jsPlumb_nodes[j]['data-item'] == 'hardware_board_item') {
						mainboard = jsPlumb_nodes[j];
						mainboardIndex = j;
						break;
					}
				}
				if (mainboard != null) {
					var usedPort = '';
					var usedBits = [];
					if (usedPortBit.indexOf('-') > -1) {
						var arrFromTo = usedPortBit.split('-');
						usedPort = arrFromTo[0].substring(0, 1);
						var tmpIntStart = Number(arrFromTo[0].substring(1));
						var tmpIntEnd = Number(arrFromTo[1].substring(1));
						for (var j = tmpIntStart; j <= tmpIntEnd; j++) {
							usedBits.push(j);
						}
					} else if (usedPortBit.indexOf(',') > -1) {
						var arrTwo = usedPortBit.split(',');
						usedPort = arrFromTo[0].substring(0, 1);
						usedBits.push(Number(arrTwo[0].substring(1)));
						usedBits.push(Number(arrTwo[1].substring(1)));
					} else {
						usedPort = usedPortBit.substring(0, 1);
						usedBits.push(Number(usedPortBit.substring(1)));
					}
					var usedPortIndex = 0;
					switch (usedPort) {
						case 'A':
							usedPortIndex = 0;
							break;
						case 'B':
							usedPortIndex = 1;
							break;
						case 'C':
							usedPortIndex = 2;
							break;
						case 'D':
							usedPortIndex = 3;
							break;
						case 'E':
							usedPortIndex = 4;
							break;
						case 'F':
							usedPortIndex = 5;
							break;
						case 'G':
							usedPortIndex = 6;
							break;
						case 'H':
							usedPortIndex = 7;
							break;
						default:
							usedPortIndex = 0;
							break;
					}
					var oldPortBit = mainboard['add_info']['points'][usedPortIndex]['bit'];
					var subBits = '';
					for (var j = 0; j < usedBits.length; j++) {
						subBits += '1';
					}
					newPortBit = oldPortBit.substring(0, usedBits[0]) + subBits + oldPortBit.substring(usedBits[usedBits.length - 1] + 1);
					mainboard['add_info']['points'][usedPortIndex]['bit'] = newPortBit;
					if (newPortBit.indexOf('0') < 0) {
						// 当端口位都未被使用的情况下，若父节点是转接板的话，则要去掉转接板
						adpterExistFlag = true;
					}
					jsPlumb_nodes[mainboardIndex] = mainboard;
				}
			}
			jsPlumb_nodes.splice(tmpIndex, 1);

			if (adpterExistFlag) {
				for (var i = 0; i < parentNodes.length; i++) {
					if ($(parentNodes[i]).attr('data-item') == 'hardware_adapter_item') {
						jsPlumb_instance.remove(parentNodes[i]);
						var tmpParentNodes = getSelectedJsPlumbNode($(parentNodes[i]));
						jsPlumb_nodes.splice(tmpParentNodes.index, 1);
						$(parentNodes[i]).remove();
					}
				}
			}
		}
	}

	function getConfig(name) {
		var names = name.split('_');
		name = names.length > 1 ? names[1] : name;
		return configs[name];
	}

	function getAndInitLinkEndpoint(nodeType) {
		var nodeConfig = getConfig(nodeType);
		var name = nodeConfig.name;
		var bits = nodeConfig.bits;
		var needle = "";
		for (var i = 0; i < bits; i++) {
			needle += "1";
		}

		$.ajax({
			type: "POST",
			url: "/board/match",
			data: {
				name: name
			},
			dataType: "json",
			async: false, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				// 根据连线规则，控制器连接，空余连接位进行连接点校准
				for (var i = 0; i < jsPlumb_nodes.length; i++) {
					var tmpAddInfo = jsPlumb_nodes[i]['add_info'];

					// 确认本来就存在可连接的控制器
					if (result[tmpAddInfo['id']] != null && result[tmpAddInfo['id']] != undefined) {
						var tmpTargetId = jsPlumb_nodes[i]['id'];

						// 接口返回可连接点信息
						var canLinkPointInfo = {};
						for (var j = 0; j < result[tmpAddInfo['id']].length; j++) {
							canLinkPointInfo[result[tmpAddInfo['id']][j]['name']] = result[tmpAddInfo['id']][j]['bits'];
						}

						// 循环实际连接点，比对目标控制器当前的连接状态进行连接点匹配
						for (var j = 0; j < tmpAddInfo.points.length; j++) {
							var onePoint = tmpAddInfo.points[j];
							var onePointBit = onePoint['bit'];
							// 只有主板能连并且对应的连接规则成立时才可以进行连接，连接点才能高亮显示
							if (canLinkPointInfo[onePoint['port']] != null && canLinkPointInfo[onePoint['port']] != undefined) {
								var oneCanLinkPoint = canLinkPointInfo[onePoint['port']];
								if (oneCanLinkPoint.indexOf(needle) > -1 && onePoint['bit'].indexOf(needle) > -1) {
									if (onePointBit.length != oneCanLinkPoint.length) {
										continue;
									}
									var tmpEndpoint = jsPlumb_instance.getEndpoint(tmpTargetId + "_" + onePoint['position']);
									linkableEndpoints.push(tmpEndpoint);

									var arrOnePointBit = onePointBit.split('');
									for (var k = 0; k < arrOnePointBit.length; k++) {
										var tmpChar = oneCanLinkPoint.charAt(k);
										if (tmpChar == 0 || tmpChar == '0') {
											arrOnePointBit[k] = 0;
										}
									}
									linkablePortBits[onePoint['port']] = arrOnePointBit.join('');
								}
							}
						}
					}
				}
				for (var i = 0; i < linkableEndpoints.length; i++) {
					linkableEndpoints[i].setPaintStyle({
						fillStyle: '#FF0'
					});
				}
			}
		});
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

	function getConnectedBit(targetJsPlumbNode, nodePort, jsPlumbNode) {
		var returnStrBit = '';
		// 当前端口、位信息
		var nowBitStatus = linkablePortBits[nodePort];
		if (nowBitStatus == null) {
			return false;
		}

		// 需要的位信息
		var needBits = jsPlumbNode['add_info']['bits'];
		var needle = '';
		var reverseNeedle = '';
		for (var j = 0; j < needBits; j++) {
			needle += '1';
			reverseNeedle += '0';
		}
		if (needBits == 1) {
			returnStrBit = nodePort + nowBitStatus.indexOf(needle);
		} else if (needBits == 2) {
			returnStrBit = nodePort + nowBitStatus.indexOf(needle);
			returnStrBit += "," + nodePort + (nowBitStatus.indexOf(needle) + 1);
		} else {
			returnStrBit = nodePort + nowBitStatus.indexOf(needle);
			returnStrBit += "-" + nodePort + (nowBitStatus.indexOf(needle) + needBits - 1);
		}

		// 位使用后的端口情况
		var newBitStatus = nowBitStatus.substr(0, nowBitStatus.indexOf(needle)) + reverseNeedle + nowBitStatus.substr(nowBitStatus.indexOf(needle) + needle.length);

		for (var j = 0; j < targetJsPlumbNode['add_info']['points'].length; j++) {
			if (targetJsPlumbNode['add_info']['points'][j]['port'] == nodePort) {
				targetJsPlumbNode['add_info']['points'][j]['bit'] = newBitStatus;
				break;
			}
		}

		for (var j = 0; j < jsPlumb_nodes.length; j++) {
			if (jsPlumb_nodes[j].id == targetJsPlumbNode.id) {
				jsPlumb_nodes.splice(j, 1, targetJsPlumbNode);
				break;
			}
		}

		return returnStrBit;
	}

	function isEmpty() {
		return jsPlumb_nodes.length == 0;
	}

	return {
		init: init,
		isEmpty: isEmpty,
	}
});
