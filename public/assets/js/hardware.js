/**
 * <div id="flowchart_if" data-item="flowchart_if_item" class="flowchart-item flowchart-prismatic">判定</div>
 *	右侧拖拽栏中的id只是用来最后的标志，虽然可以事后识别，但最好还是带上意义，比如if
 *	data-item对象才是重点，对应flowchart-item-set.js中配置的关键字
 *	参数jsPlumb_container所指定的区域是绘制流程图的区域，即id为jsPlumb_container的DIV
 *	需要为jsPlumb_container设定css样式，控制描图区域
 *	需要为jsPlumb_container+"-item"元素指定css样式，控制每个生成的流程元素块的大小
 */
define(["jquery", "jsplumb", "eventcenter", "d3", "flowchart_item_set", "jquery-ui"], function($, jsPlumb, eventcenter, d3, fis) {
	var showGuide = null;

	function setShowGuid(show) {
		showGuide = show;
	}

	var jsPlumb_container = 'hardware-container';
	var jsPlumb_instance = null;
	var jsPlumb_nodes = [];
	var jsPlumb_selected_node = null;

	var container_width = 0;
	var container_height = 0;
	var container_init_x = 0;
	var container_init_y = 0;

	var moved_container_width = 0;
	var moved_container_height = 0;
	var moved_container_x = 0;
	var moved_container_y = 0;

	var dragging_left = 0;
	var dragging_top = 0;

	var data_transfer = {};

	// 拖拽时临时产生的提示连接点
	var linkableEndpoints = [];
	// 可能使用的端口、位信息
	var linkablePortBits = {};

	var initCloseEndpoint = null;

	// 放大缩小
	var scrollLever = 0;
	var ratio = 1;

	/**
	 * 整个处理的入口，需要初始化
	 * @param string strContainer 用来绘制流程图的DIV
	 * @param string itemClass 可以拖拽的元素
	 */
	function init(itemClass, strContainer) {
		// console.log(fis);
		jsPlumb_container = strContainer;
		if (jsPlumb_container.length == 0) {
			alert("缺少搭建流程图的位置");
			return false;
		}

		container_width = $('#' + jsPlumb_container).width();
		container_height = $('#' + jsPlumb_container).height();
		container_init_x = $('#' + jsPlumb_container).offset().left;
		container_init_y = $('#' + jsPlumb_container).offset().top;
		moved_container_width = $('#' + jsPlumb_container).width();
		moved_container_height = $('#' + jsPlumb_container).height();
		moved_container_x = $('#' + jsPlumb_container).offset().left;
		moved_container_y = $('#' + jsPlumb_container).offset().top;

		jsPlumb.ready(function() {
			//Initialize JsPlumb
			initJsPlumbInstance();

			$('div.' + itemClass).attr('draggable', 'true').on('dragstart', function(ev) {
				initDrag(ev, this);
			}).on('touchstart', function(ev) {
				initDrag(ev, this);
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
				if (showGuide)
					showGuide(2);
				// linkableEndpoints=[];
			}).on('dragover', function(ev) {
				ev.preventDefault();
			});

			jsPlumb.fire("jsFlowLoaded", jsPlumb_instance);

			initMainBoard();
		});

		$(window).resize(function(e) {
			var new_container_width = $('#' + jsPlumb_container).width();
			var move_distance = (container_width - new_container_width) / 2;
			moveAllNodes(move_distance);
			container_width = new_container_width;
		});

		// 右键菜单
		rightClick();

		eventcenter.bind('hardware', 'mousewheel', function(args) {
			var mousescroll = args.e; //1为放大，-1为缩小
			if (mousescroll > 0 && scrollLever < 5) {
				scrollLever++;
			} else if (mousescroll < 0 && scrollLever > -5) {
				scrollLever--;
			}

			resizeAllNode();
		});

		movePanel();
	}

	function resizeAllNode() {
		var newRatio = 1;
		if(scrollLever > 0) {
			newRatio = scrollLever;
		}else if (scrollLever < 0) {
			newRatio = 1 / Math.abs(scrollLever);
		}
		if(newRatio == ratio){
			return;
		}
		ratio = newRatio;

		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			var node = jsPlumb.getSelector('#' + jsPlumb_nodes[i]['id'])[0];
			$(node).width(jsPlumb_nodes[i]['width'] * ratio).height(jsPlumb_nodes[i]['height'] * ratio);
			// 重绘流程元素
			jsPlumb_instance.repaint(node);
		}

		// 原主板中心位置
		var mainboardJN = jsPlumb_nodes[0];
		var centerX = parseInt(mainboardJN['x']) + mainboardJN['width'] / 2.0;
		var centerY = parseInt(mainboardJN['y']) + mainboardJN['height'] / 2.0;

		// 缩放所有的图块
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			// 原元件中心位置
			var jsPlumbNode = jsPlumb_nodes[i];
			var tmpCX = parseInt(jsPlumbNode['x']) + jsPlumbNode['width'] / 2.0;
			var tmpCY = parseInt(jsPlumbNode['y']) + jsPlumbNode['height'] / 2.0;
			// 现元件中心位置
			var tmpNode = $(jsPlumb.getSelector('#' + jsPlumbNode['id'])[0]);
			var mbcX = tmpNode.position().left + tmpNode.width() / 2.0;
			var mbcY = tmpNode.position().top + tmpNode.height() / 2.0;
			// 若原元件中心和原主板中心位置相同，则是中心主板，直接进行移动即可，否则重新计算位置，进行移动
			if (tmpCX == centerX && tmpCY == centerY) {
				var moveCX = mbcX - tmpCX;
				var moveCY = mbcY - tmpCY;
				moveOneNode(jsPlumbNode['id'], moveCX, moveCY);
			} else {
				// 目标中心位置
				var aimX = centerX - (centerX - tmpCX) * ratio;
				var aimY = centerY - (centerY - tmpCY) * ratio;
				var moveCX = mbcX - aimX;
				var moveCY = mbcY - aimY;
				moveOneNode(jsPlumbNode['id'], moveCX, moveCY);
			}
		}
	}

	function checkPosition(x, y, v) {
		var div = $("<div>" + v + "</div>").css({
			'position': 'absolute',
			'left': x + 'px',
			'top': y + 'px',
			'zIndex': 1000
		});
		$('#' + jsPlumb_container).append(div);
	}

	function movePanel() {
		eventcenter.bind('hardware', 'mousedown', function(e) {
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
					default:
						break;
				}
			},
			items: {
				// "edit": {name: "Edit", icon: "edit"},
				// "cut": {name: "Cut", icon: "cut"},
				// "copy": {name: "Copy", icon: "copy"},
				// "paste": {name: "Paste", icon: "paste"},
				"delete": {
					name: "Delete",
					icon: "delete"
				},
				// "sep1": "---------",
				// "quit": {name: "Quit", icon: "quit"}
			}
		});
	}

	function moveAllNodes(xDistance, yDistance) {
		if (yDistance == null) {
			yDistance = 0;
		}
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			moveOneNode(jsPlumb_nodes[i]['id'], xDistance, yDistance);
		}
	}

	function moveOneNode(id, xDistance, yDistance) {
		var node = jsPlumb.getSelector('#' + id)[0];
		var left = $('#' + id).position().left;
		$(node).css("left", (left - xDistance) + "px");
		var top = $('#' + id).position().top;
		$(node).css("top", (top - yDistance) + "px");
		//重绘流程元素
		jsPlumb_instance.repaint(node);
	}

	function initMainBoard() {
		var left = container_width / 2 - 165;
		var top = container_height / 2 - 135;
		var firstNodeParam = {};
		firstNodeParam['x'] = '' + left + 'px';
		firstNodeParam['y'] = '' + top + 'px';
		firstNodeParam['id'] = "hardware_board_" + (new Date().getTime());
		firstNodeParam['data-item'] = "hardware_board_item";
		firstNodeParam['text'] = "主板";
		var startNode = initNode(firstNodeParam);

		eventcenter.delaytrigger('hardware', 'finish_drag', {
			"id": firstNodeParam['id'],
			"kind": getNodeInfoByKey(firstNodeParam['data-item'], "kind"),
			"type": getNodeInfoByKey(firstNodeParam['data-item'], "type"),
			"name": getNodeInfoByKey(firstNodeParam['data-item'], "name"),
			"port": "",
			"add_info": "",
			"text": firstNodeParam['text'],
			"left": left,
			"top": top,
		});
	}

	/**
	 * 为jsPlumb面板增加一个流程元素
	 * @param object param {id:"",data-item:"",text:"",x:"",y:""}的信息集
	 */
	function initNode(param) {
		var tmpAddInfo = {};
		for (var i in fis[param['data-item']]) {
			tmpAddInfo[i] = fis[param['data-item']][i];
		}
		if (param['add_info']) {
			tmpAddInfo = param['add_info'];
		}
		var node = addNode(jsPlumb_container, param);
		param['add_info'] = tmpAddInfo;
		param['width'] = $(node).width();
		param['height'] = $(node).height();
		jsPlumb_nodes.push(param);
		if (node === false) {
			return false;
		}
		addPorts(node);
		jsPlumb_instance.draggable($(node), {gird: [5, 5]});

		$(node).dblclick(function(ev) {
			// deleteNodeByElement(this);
			// jsPlumb_instance.remove(this);

			// for(var i=0;i<jsPlumb_nodes.length;i++){
			// 	if(jsPlumb_nodes[i]['id']==$(node).attr('id')){
			// 		eventcenter.trigger('hardware','finish_remove',{
			// 			"id":jsPlumb_nodes[i]['id']
			// 		});
			// 		jsPlumb_nodes.splice(i,1);
			// 		break;
			// 	}
			// }
		}).click(function(e) {
			//为流程元素新增选中激活时间
			var divElement = $("#" + $(node).attr('id'));
			if (divElement.hasClass("item-border-show")) {
				divElement.removeClass("item-border-show");
				jsPlumb_selected_node = null;
				eventcenter.trigger("kenrobot", "jsplumb_element_click", null);
			} else {
				$(".item-border-show").removeClass("item-border-show");
				divElement.addClass("item-border-show");
				jsPlumb_selected_node = node;
				for (var i = 0; i < jsPlumb_nodes.length; i++) {
					if ($(jsPlumb_selected_node).attr('id') == jsPlumb_nodes[i]['id']) {
						eventcenter.trigger("kenrobot", "jsplumb_element_click", jsPlumb_nodes[i]);
						break;
					}
				}
			}
		}).on('dragover', function(e) {
			onDragoverEvent(e, this);
		}).on('mouseover', function(e) {
			showDesc(node, 1);
		}).on('mouseout', function(e) {
			showDesc(node, 2);
		});
		// $(node).on("dragenter",function(e){
		// 	var divElement=$("#"+$(node).attr('id'));
		// 	divElement.css("border","1px solid #F00");
		// }).on("dragleave",function(e){
		// 	var divElement=$("#"+$(node).attr('id'));
		// 	divElement.css("border","");
		// });

		return node;
	}

	function setRelativeMovingPosition(ev) {
		// 获取相对元素内的相对移动位置
		dragging_left = ev.originalEvent.x;
		dragging_top = ev.originalEvent.y;
	}

	function onDragoverEvent(e, obj) {
		var nowJsPlumbNodeAddInfo = getSelectedJsPlumbNodeByObj($(obj)).node.add_info;
		if (nowJsPlumbNodeAddInfo.isController != 1) {
			return false;
		}

		var objX = Math.floor($(obj).offset().left);
		var objY = Math.floor($(obj).offset().top);
		// console.log(dragging_top+" "+dragging_left);
		// console.log($(obj).offset().top +" "+ $(obj).offset().left);

		var mousemoveX = Math.floor(dragging_left) - objX;
		var mousemoveY = Math.floor(dragging_top) - objY;

		var closeEndpoint = null;
		var closeDistance = 0;
		for (var i = 0; i < linkableEndpoints.length; i++) {
			linkableEndpoints[i].setPaintStyle({
				fillStyle: '#FF0'
			});
			var tmpX = Math.floor($(linkableEndpoints[i].canvas).offset().left) - objX;
			var tmpY = Math.floor($(linkableEndpoints[i].canvas).offset().top) - objY;
			// console.log(tmpX+","+tmpY);
			if (closeEndpoint == null) {
				closeEndpoint = linkableEndpoints[i];
				closeDistance = Math.sqrt(Math.pow((mousemoveY - tmpY), 2) + Math.pow((mousemoveX - tmpX), 2));
			} else {
				tmpDistance = Math.sqrt(Math.pow((mousemoveY - tmpY), 2) + Math.pow((mousemoveX - tmpX), 2));
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
		var nowJsPlumbNodeAddInfo = getSelectedJsPlumbNode(node).node.add_info;

		if (nowJsPlumbNodeAddInfo.category && nowJsPlumbNodeAddInfo.category != undefined) {
			showText += nowJsPlumbNodeAddInfo.category;
		}
		if (nowJsPlumbNodeAddInfo.name_cn && nowJsPlumbNodeAddInfo.name_cn != undefined) {
			showText += '：' + nowJsPlumbNodeAddInfo.name_cn;
		}
		if (showText.length === 0) {
			return false;
		}
		if (nowJsPlumbNodeAddInfo.isController == 1) {
			showText += '；可用端口信息：';
			for (var i = 0; i < nowJsPlumbNodeAddInfo.points.length; i++) {
				showText += ' <span style="font-size:12px;">' + (nowJsPlumbNodeAddInfo.points)[i].port + ":" + (nowJsPlumbNodeAddInfo.points)[i].bit + '</span>';
			}
		} else {
			showText += '；使用端口位：' + nowJsPlumbNodeAddInfo.usedPortBit;
			if (nowJsPlumbNodeAddInfo.func && nowJsPlumbNodeAddInfo.func != undefined) {
				showText += '；函数：' + nowJsPlumbNodeAddInfo.func;
			}
		}
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

	// 根据html元素删除节点对象
	function deleteNodeByElement(obj) {
		deleteNode(jsPlumb.getSelector('#' + $(obj).attr('id'))[0]);
	}

	// 删除流程元素
	function deleteNode(node) {
		if ($(node).attr("data-item") == "hardware_board_item") {
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

	/**
	 * 新增一个流程元素
	 * @param string parentId 整个流程图绘制版DIV的id
	 * @param object param {id:"",data-item:"",text:"",x:"",y:""}的信息集
	 */
	function addNode(parentId, param) {
		var objSet = fis[param['data-item']];
		var panel = d3.select("#" + parentId);

		if (objSet.unique && $("div[data-item='" + param['data-item'] + "']", $("#" + parentId)).length > 0) {
			alert("指定硬件元件在流程中只能使用一次");
			return false;
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
			.text(param['text']);
		return jsPlumb.getSelector('#' + param['id'])[0];
	}

	/**
	 * 根据配置为流程增加endpoint
	 * @param element node 一个流程元素
	 */
	function addPorts(node) {
		//Assume horizental layout
		var arrAnchor = fis[$(node).attr('data-item')].points;
		for (var i = 0; i < arrAnchor.length; i++) {
			var tmpUuid = node.getAttribute("id") + "_" + arrAnchor[i].position;
			var tmpPaintStyle = {
				radius: 5,
				fillStyle: arrAnchor[i].color
			};
			var tmpShape = arrAnchor[i].shape;
			jsPlumb_instance.addEndpoint(node, {
				endpoint: tmpShape,
				uuid: tmpUuid,
				paintStyle: tmpPaintStyle,
				anchor: arrAnchor[i].position,
				maxConnections: -1,
				isSource: arrAnchor[i].source,
				isTarget: arrAnchor[i].target,
				//连线不能被手动删除
				connectionsDetachable: false,
			});
			//鼠标进入连接点时候激活的处理
			jsPlumb_instance.getEndpoint(tmpUuid).bind("mouseenter", function(e) {
				console.log("mouseenter");
			});
		}
	}

	/**
	 * 连接两个endpoint
	 * @param string sourceId 起点endpoint的uuid	
	 * @param string targetId 终点endpoint的uuid
	 */
	function connectPortsByUuid(sourceId, targetId) {
		jsPlumb_instance.connect({
			uuids: [sourceId, targetId]
		});
	}

	/**
	 * 连接两个endpoint
	 * @param string/endpoint source 起点	
	 * @param string/endpoint target 终点
	 */
	function connectPortsBySt(source, target) {
		jsPlumb_instance.connect({
			source: source,
			target: target
		});
	}

	/**
	 * @desc 通过制定的data_item信息获取flowchart_item_set中的kind信息，即流程元素所属
	 * @param string data_item
	 * @param string key
	 */
	function getNodeInfoByKey(data_item, key) {
		var objSet = fis[data_item];
		if (objSet[key] && objSet[key] != undefined) return objSet[key];
		return false;
	}

	/**
	 * 初始化整个画板，同时增加双击链接取消链接功能
	 */
	function initJsPlumbInstance() {
		var color = "#333";
		jsPlumb_instance = jsPlumb.getInstance({
			// Connector : [ "StateMachine", { curviness:1 } ],
			Connector: ["Flowchart", {
				gap: 10,
				// curviness: 50,
				// midpoint: 1,
				stub: 20,
				cornerRadius: 5,
				alwaysRespectStubs: true
			}],
			//DragOptions : { cursor: "pointer", zIndex:2000 },
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
			//ConnectionOverlays : [["Arrow",{ width:10,length:10,location:-5}]],
			Container: jsPlumb_container
		});
		jsPlumb_instance.bind("dblclick", function(conn, e) {
			jsPlumb_instance.detach(conn);
		});
		jsPlumb_instance.setZoom(1);
	}

	/**
	 * 初始化拖拽功能
	 * @param event e 鼠标拖拽实践
	 */
	function initDrag(e) {
		scrollLever = 0;
		resizeAllNode();

		try {
			e.originalEvent.dataTransfer.setData('text', e.target.id);
			e.originalEvent.dataTransfer.setData('offsetX', e.originalEvent.offsetX);
			e.originalEvent.dataTransfer.setData('offsetY', e.originalEvent.offsetY);
		} catch (e) {

		}
		data_transfer['text'] = e.target.id;
		data_transfer['offsetX'] = e.originalEvent.offsetX;
		data_transfer['offsetY'] = e.originalEvent.offsetY;
		getAndInitLinkEndpoint(e);
	}

	/** 
	 * 确认连接点（通过控制器、端口、位等信息进行确认连接）
	 *	@param event e
	 */
	function getAndInitLinkEndpoint(e) {
		var fisKey = $(e.target).attr('data-item');
		var name = getNodeInfoByKey(fisKey, 'name');
		var bits = getNodeInfoByKey(fisKey, 'bits');
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

	/**
	 * 完成元素拖拽后的处理
	 * @param event e 鼠标拖拽实践
	 */
	function finishDrag(e) {
		// 如果无可连接点，则返回
		if (linkableEndpoints == null || linkableEndpoints.length == 0) {
			return false;
		};

		//拖拽对象不是连接目标的时候
		var targetDiv = $(e.target);
		var originalEventOffsetX = e.originalEvent.offsetX;
		var originalEventOffsetY = e.originalEvent.offsetY;

		if (targetDiv.closest("div").attr('class').indexOf('_jsPlumb') < 0 || targetDiv.closest("div").attr('class').indexOf(jsPlumb_container + '-item') < 0) {
			// if(targetDiv.closest('div').attr('class').indexOf('_jsPlumb_endpoint')>=0 && targetDiv.closest('div').attr('class').indexOf('_jsPlumb_endpoint_anchor_')>=0){
			// 	console.log(targetDiv.offset());
			// 	while(targetDiv.closest('div').attr('class').indexOf('hardware-container-item')<0){
			// 		originalEventOffsetX=targetDiv.offset().left;
			// 		originalEventOffsetY=targetDiv.offset().top;
			// 		targetDiv=targetDiv.closest('div').prev();
			// 		originalEventOffsetX=originalEventOffsetX-targetDiv.offset().left;
			// 		originalEventOffsetY=originalEventOffsetY-targetDiv.offset().top;
			// 	}
			// }else{
			return false;
			// }
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
		var flowchart_obj_param_x = originalEventOffsetX - startOffsetX;
		var flowchart_obj_param_y = originalEventOffsetY - startOffsetY;
		flowchart_obj_param['x'] = '' + flowchart_obj_param_x + 'px';
		flowchart_obj_param['y'] = '' + flowchart_obj_param_y + 'px';

		flowchart_obj_param['id'] = objId + "_" + (new Date().getTime());
		flowchart_obj_param['data-item'] = $("#" + objId).attr('data-item');
		flowchart_obj_param['text'] = $("#" + objId).text();
		if (flowchart_obj_param['text'].length == 0) {
			flowchart_obj_param['text'] = $("#" + objId).parent().text();
		}

		var node = initNode(flowchart_obj_param);
		var nodeFis = fis[flowchart_obj_param['data-item']];
		var nodePort = '';
		targetJsPlumbNode = null;

		// 若拖拽进入已有元素，则自动连接，并调整元素位置
		if (targetDiv.closest("div").attr('class').indexOf('_jsPlumb') >= 0) {
			var sourceFis = fis[$(targetDiv.closest("div")).attr("data-item")];
			for (var i = 0; i < jsPlumb_nodes.length; i++) {
				if (jsPlumb_nodes[i]['id'] === $(targetDiv.closest("div")).attr('id')) {
					targetJsPlumbNode = jsPlumb_nodes[i];
					sourceFis = jsPlumb_nodes[i]['add_info'];
				}
			}

			var sEndpoint = initCloseEndpoint;
			if (sEndpoint == null) {
				sEndpoint = getNearestEndPointFromNode(targetDiv, node, flowchart_obj_param_x, flowchart_obj_param_y);
			}

			// 确认该点的端口
			var sEndpointX = sEndpoint.anchor.x;
			var sEndpointY = sEndpoint.anchor.y;
			var sourceFisPoints = sourceFis['points'];
			for (var i = 0; i < sourceFisPoints.length; i++) {
				if (sEndpointX == sourceFisPoints[i].position[0] && sEndpointY == sourceFisPoints[i].position[1] && sEndpoint.isSource == sourceFisPoints[i].source && sEndpoint.isTarget == sourceFisPoints[i].target) {
					nodePort = sourceFisPoints[i].port;
				}
			}

			var userInitFlag = true;
			//连接点在硬件主板上，且连接元素室LED灯时，需要确认转接口的存在
			if (sourceFis.kind == "hardware" && (sourceFis.type == 'board')) {
				var hasAdapter = false;
				var conns = jsPlumb_instance.getConnections({
					source: targetDiv.closest("div")
				});
				if (nodeFis.kind == "hardware" && nodeFis.needsPinboard == 1) {
					//确认是否在该点上有链接的转接口
					for (var i = 0; i < conns.length; i++) {
						if (conns[i].endpoints[0].getUuid() != sEndpoint.getUuid()) continue;

						for (var j = 0; j < conns[i].endpoints.length; j++) {
							var tmpEndpoint = conns[i].endpoints[1];
							var tmpNodeFis = fis[$(tmpEndpoint.getElement()).attr("data-item")];
							if (tmpNodeFis.kind == "hardware" && tmpNodeFis.type == "adapter") {
								hasAdapter = true;
								targetDiv = $(tmpEndpoint.getElement());
								break;
							}
						}
					}
					if (!hasAdapter) {
						var adapterNodeParam = {};
						adapterNodeParam['x'] = flowchart_obj_param['x'];
						adapterNodeParam['y'] = flowchart_obj_param['y'];
						adapterNodeParam['id'] = "hardware_adapter_" + (new Date().getTime());
						adapterNodeParam['data-item'] = "hardware_adapter_item";
						adapterNodeParam['text'] = "转接口";
						var adapterNode = initNode(adapterNodeParam);
						initConnection(
							adapterNode,
							targetDiv,
							flowchart_obj_param_x,
							flowchart_obj_param_y
						);
						targetDiv = $(adapterNode);
					}
					userInitFlag = false;
				}
			}

			initConnection(
				node,
				targetDiv,
				flowchart_obj_param_x,
				flowchart_obj_param_y,
				userInitFlag
			);

			// initCloseEndpoint.setPaintStyle({fillStyle:"#FF0"});
		}

		// for(var i=0;i<jsPlumb_nodes.length;i++){
		// 	if(jsPlumb_nodes[i]['id']==$(node).attr('id')){
		// 		// if(jsPlumb_nodes[i] && (jsPlumb_nodes[i]['add_info']==null || jsPlumb_nodes[i]['add_info']==undefined)){
		// 		// 	jsPlumb_nodes[i]['add_info']="";
		// 		// }

		// 		var usedPortBit=getConnectedBit(targetJsPlumbNode,nodePort,jsPlumb_nodes[i]);

		// 		jsPlumb_nodes[i]['add_info']['port']=nodePort;
		// 		jsPlumb_nodes[i]['add_info']['usedPortBit']=usedPortBit;
		// 		var data={
		// 			"id":jsPlumb_nodes[i]['id'],
		// 			"kind":nodeFis.kind,
		// 			"type":nodeFis.type,
		// 			"port":usedPortBit,
		// 			"add_info":jsPlumb_nodes[i]['add_info'],
		// 			"text":jsPlumb_nodes[i]['text'],
		// 			"left":$(node).position().left,
		// 			"top":$(node).position().top
		// 		}
		// 		for(var ii in nodeFis){
		// 			if(ii=="port" || ii == 'usedPortBit' || ii == 'rotate')continue;
		// 			data[ii]=nodeFis[ii];
		// 		}
		// 		eventcenter.trigger('hardware','finish_drag',data);
		// 		break;
		// 	}
		// }

		var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
		if (tmpJsPlumbNode.index > -1) {
			var tmpNode = tmpJsPlumbNode.node;
			var tmpIndex = tmpJsPlumbNode.index;
			var usedPortBit = getConnectedBit(targetJsPlumbNode, nodePort, tmpNode);

			tmpNode['add_info']['port'] = nodePort;
			tmpNode['add_info']['usedPortBit'] = usedPortBit;

			jsPlumb_nodes.splice(tmpIndex, 1, tmpNode);
			var data = {
				"id": tmpNode['id'],
				"kind": nodeFis.kind,
				"type": nodeFis.type,
				"port": usedPortBit,
				"add_info": tmpNode['add_info'],
				"text": tmpNode['text'],
				"left": $(node).position().left,
				"top": $(node).position().top
			}
			for (var i in nodeFis) {
				if (i == 'port' || i == 'usedPortBit' || i == 'rotate') {
					continue;
				}
				data[i] = nodeFis[i];
			}
			eventcenter.trigger('hardware', 'finish_drag', data);
		}

		try {
			e.originalEvent.dataTransfer.clearData();
			data_transfer = {};
		} catch (ev) {
			data_transfer = {};
		}

		initCloseEndpoint = null;

		// 将每个元素的位置信息进行一次处理，为放大缩小进行位置信息整理准备
		for (var i = 0; i < jsPlumb_nodes.length; i++) {
			jsPlumb_nodes[i]['x'] = $(jsPlumb.getSelector('#' + jsPlumb_nodes[i]['id'])[0]).position().left;
			jsPlumb_nodes[i]['y'] = $(jsPlumb.getSelector('#' + jsPlumb_nodes[i]['id'])[0]).position().top;
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
	 * @desc 获取对应端口上的使用位信息
	 * @param jsPlumb_node targetJsPlumbNode对应目前拖拽对象放置位置目标对象
	 * @param string nodePort 使用目标端口
	 * @param jsPlumb_node jsPlumbNode 拖拽对象
	 * @return string
	 */
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
			// returnStrBit+=nodePort+(nowBitStatus.indexOf(needle));
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

	/**
	 * @desc拖拽至元素时自动绘制图形位置，需将已有下属元素进行位置调整
	 * @param node 流程元素
	 * @param event e 事件
	 * @param float centerX 实际中心点当前位置
	 * @param float centerY 实际中心点当前位置
	 */
	function initConnection(node, target, centerX, centerY, userInitFlag) {
		if (userInitFlag == null) {
			userInitFlag = false;
		}
		var targetDiv = target.closest("div");

		var nodeName = getNodeInfoByKey($(node).attr('data-item'), 'name');

		var sourceEndPoint = null;
		if (userInitFlag) {
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
		var sourceFis = fis[$(targetDiv).attr("data-item")];
		//根据最近的起始连接点重定位新流程元素位置
		var objX = 0;
		var objY = 0;

		var relativeDistance = getLeftTopToSourceEndpointDistance(node);
		if (sourceFis.kind == "hardware") {
			var baseX = $(sourceEndPoint.canvas).position().left;
			var baseY = $(sourceEndPoint.canvas).position().top;
			if (sourceFis.type == "board") {
				// objX=baseX+9-$(node).outerWidth()/2;
				objX = baseX - relativeDistance;
				//主板连接点定制
				if (sourceEndPoint.anchor.y < 0.5) {
					//主板上连接点
					if (nodeName == 'adapter') {
						objY = baseY - $(node).outerHeight();
					} else {
						objY = baseY - $(node).outerHeight() - 30;
					}
					$(node).addClass("content-rotate");
					var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
					if (tmpJsPlumbNode.index > -1) {
						tmpJsPlumbNode.node['add_info']['rotate'] = 1;
						jsPlumb_nodes.splice(tmpJsPlumbNode.index, 1, tmpJsPlumbNode.node);
					}
					// for(var i=0;i<jsPlumb_nodes.length;i++){
					// 	if(jsPlumb_nodes[i]['id']==$(node).attr('id')){
					// 		jsPlumb_nodes[i]['add_info']['rotate']=1;
					// 		break;
					// 	}
					// }
					var targetEndPoints = jsPlumb_instance.getEndpoints($(node));
					for (var i = 0; i < targetEndPoints.length; i++) {
						targetEndPoints[i].anchor.x = 1 - targetEndPoints[i].anchor.x;
						targetEndPoints[i].anchor.y = 1 - targetEndPoints[i].anchor.y;
					}
				} else {
					//主板下连接点
					if (nodeName == 'adapter') {
						objY = baseY + 10;
					} else {
						objY = baseY + 40;
					}
				}
			} else {
				if ($(targetDiv).hasClass("content-rotate")) {
					//父点旋转，子点也旋转
					// objX=baseX+3-$(node).outerWidth()/2;
					objX = baseX - relativeDistance;
					objY = baseY - $(node).outerHeight() - 30;
					$(node).addClass("content-rotate");
					var tmpJsPlumbNode = getSelectedJsPlumbNode(node);
					if (tmpJsPlumbNode.index > -1) {
						tmpJsPlumbNode.node['add_info']['rotate'] = 1;
						jsPlumb_nodes.splice(tmpJsPlumbNode.index, 1, tmpJsPlumbNode.node);
					}
					// for(var i=0;i<jsPlumb_nodes.length;i++){
					// 	if(jsPlumb_nodes[i]['id']==$(node).attr('id')){
					// 		jsPlumb_nodes[i]['add_info']['rotate']=1;
					// 		break;
					// 	}
					// }
					var targetEndPoints = jsPlumb_instance.getEndpoints($(node));
					for (var i = 0; i < targetEndPoints.length; i++) {
						targetEndPoints[i].anchor.x = 1 - targetEndPoints[i].anchor.x;
						targetEndPoints[i].anchor.y = 1 - targetEndPoints[i].anchor.y;
					}
				} else {
					// objX=baseX+3-$(node).outerWidth()/2;
					objX = baseX - relativeDistance;
					objY = baseY + 30;
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
		} else {
			switch (sourceEndPoint.anchor.type) {
				case "TopCenter":
					objX = baseX;
					objY = baseY - $(node).outerHeight() - 30;
					break;
				case "RightMiddle":
					objX = baseX + $(node).outerWidth() + 30;
					objY = baseY + $(node).outerHeight() + 10;
					break;
				case "BottomCenter":
					objX = baseX;
					objY = baseY + $(node).outerHeight() + 30;
					break;
				case "LeftMiddle":
					objX = baseX - $(node).outerWidth() - 30;
					objY = baseY + $(node).outerHeight() + 10;
					break;
				default:
					break;
			}
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

		if (sourceFis.kind == "flowchart") {
			//从sourceEndPoint出来的所有元素位置下移
			moveRelationalNodes(sourceEndPoint, node);
		}
		//截断需截断连接，重新连接
		// cutAndLink(sourceEndPoint,node);
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

	function getNearestEndPointFromNode(div, node, centerX, centerY) {
		var realX = $(node).outerWidth() / 2 + centerX;
		var realY = $(node).outerHeight() / 2 + centerY;

		return getNearestEndPoint(div, realX, realY);
	}

	/**
	 * @desc 截断需截断连接，重新连接
	 * @param EndPoint sourceEndPoint 起始点
	 * @param Node node 新绘制元素
	 */
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
			connectPortsBySt(sourceTargetEndPoint, connections[i].endpoints[1]);
		}
	}

	/**
	 * @desc 根据连接元素递归下移
	 * @param EndPoint sourceEndPoint 起始点
	 * @param Node node 新绘制元素
	 */
	function moveRelationalNodes(sourceEndPoint, node) {
		var connections = jsPlumb_instance.getConnections({
			source: sourceEndPoint.getElement()
		});
		//从同一个起点衍生出多个点时，需要将所有流程元素下移，除了刚刚绘制的流程元素
		for (var i = 0; i < connections.length; i++) {
			//判定该连接终点元素是不是刚刚绘制的node元素，通过ID判定
			if ($(node).attr('id') == connections[i].targetId || $(node).attr('id') == connections[i].sourceId) {
				continue;
			}
			//自己连自己的话
			if (connections[i].targetId == connections[i].sourceId || connections[i].targetId == $(sourceEndPoint.getElement()).attr("id")) {
				break;
			}

			var positionY = $(connections[i].target).position().top;
			positionY += $(connections[i].target).outerHeight() + 30;
			$(connections[i].target).css("top", positionY);
			//重绘流程元素
			jsPlumb_instance.repaint(connections[i].target);
			arguments.callee(connections[i].endpoints[1], node);
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

		var isContronller = getNodeInfoByKey($(div).attr('data-item'), 'isController');
		//根据拖拽放置情况获取离当前元素最近的连接点
		var distance = 0;
		for (var i = 0; i < sourceEndPoints.length; i++) {
			if (!sourceEndPoints[i].isSource) continue;
			// 确认连接对象是控制器，且端口、位信息可以被连接
			if (isContronller && !checkLinkable(sourceEndPoints[i])) continue;
			// 获取endpoint点所在流程元素中的相对位置
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
	 * 确认能够进行连接
	 */
	function checkLinkable(checkEndPoint) {
		if (linkableEndpoints.length == 0) return true;
		for (var i = 0; i < linkableEndpoints.length; i++) {
			if (linkableEndpoints[i] == checkEndPoint) {
				return true;
			}
		}
		return false;
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
		console.log(arrFlowchart);
	}

	/**
	 * 将目前绘制的流程图清除
	 */
	function clear() {
		$.each(jsPlumb_nodes, function(i, o) {
			jsPlumb_instance.detachAllConnections(jsPlumb_instance.getSelector("#" + o['id'])[0]);
			jsPlumb_instance.remove($("#" + o['id']));
			$("#" + o['id']).remove();
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
				"targetId": connection.endpoints[1].getUuid()
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
			//是否需要旋转180°
			var initRotateStatus = 0;
			if (o['add_info'] && o['add_info']['rotate'] && o['add_info']['rotate'] == '1') {
				initRotateStatus = 1;
			}
			var tmpNode = initNode(o);
			if (initRotateStatus == 1) {
				$(tmpNode).addClass('content-rotate');
				var targetEndPoints = jsPlumb_instance.getEndpoints($(tmpNode));
				for (var j = 0; j < targetEndPoints.length; j++) {
					targetEndPoints[j].anchor.x = 1 - targetEndPoints[j].anchor.x;
					targetEndPoints[j].anchor.y = 1 - targetEndPoints[j].anchor.y;
				}
			}
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
	 */
	return {
		init: init,
		getConnections: getConnections,
		getFlowchart: getFlowchart,
		getFlowchartElements: getFlowchartElements,
		clear: clear,
		draw: draw,
		isEmpty: isEmpty,
		setSelectedNodeInfo: setSelectedNodeInfo,
		setShowGuid: setShowGuid
	}
});