/*
 * @desc 流程元素配置文件
 * 	key:css样式class为拖拽对象元素的标签元素的data-item值
 * 	value:元素说明
 *		className:拖拽完所生成流程元素的css样式class
 *		unique:true/false表明是否是唯一流程元素，缺失默认为false（不唯一）
 *		type:元素样式类型，可以通过此类型定制化样式
 *		kind:"flowchart"/"hardware"/"software"等，元素从属类型
 *		textHide:元素上的文字是否隐藏
 *		desc:关于元素的描述
 *		points:指定流程元素附着的拖拽点的设定，设定说明如下
 *			position:拖拽点位置
 *			source:是否为起点
 *			target:是否为终点
 *			color:拖拽点颜色
 *			shape:连接点形状 Dot是圆形，Rectangle是方形
 *			port:硬件端口号
 */
define(["jquery"], function($) {
	var data = {
		//开始
		"flowchart_start_item": {
			"className": "flowchart-oval-item",
			"name": "start",
			"unique": true,
			"always": true,
			"type": "start",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}]
		},
		//loop开始
		"flowchart_loopStart_item": {
			"className": "flowchart-oval-item",
			"name": "loopStart",
			"unique": true,
			"always": true,
			"type": "loopStart",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "LeftMiddle",
				"color": "#CCC",
				"shape": "Dot"
			}]
		},
		//loop结束
		"flowchart_loopEnd_item": {
			"className": "flowchart-oval-item",
			"name": "loopEnd",
			"unique": true,
			"always": true,
			"type": "loopEnd",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			},{
				"position": "BottomCenter",
				"color": "#CCC",
				"shape": "Dot"
			}, {
				"position": "LeftMiddle",
				"color": "#CCC",
				"shape": "Dot"
			}]
		},
		//结束
		"flowchart_end_item": {
			"className": "flowchart-oval-item",
			"name": "end",
			"unique": false,
			"always": true,
			"type": "end",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"color": "#CCC",
				"shape": "Dot"
			}]
		},
		//主板
		"flowchart_board_item": {
			"className": "flowchart-board-item",
			"name": "board",
			"unique": false,
			"type": "board",
			"kind": "flowchart",
			"desc": "",
			"points": [{
					"position": "TopCenter",
					"source": false,
					"target": true,
					"color": "#FF8891",
					"shape": "Dot"
				},
				// {"position":"RightMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"},
				{
					"position": "BottomCenter",
					"source": true,
					"target": false,
					"color": "#FF0",
					"shape": "Dot"
				},
				// {"position":"LeftMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"}
			]
		},
		//灯
		"flowchart_light_item": {
			"className": "flowchart-light-item",
			"name": "light",
			"unique": false,
			"type": "light",
			"kind": "flowchart",
			"textHide": true,
			"desc": "输入高压电平，LED灯亮",
			"points": [{
					"position": "TopCenter",
					"source": false,
					"target": true,
					"color": "#FF8891",
					"shape": "Dot"
				},
				// {"position":"RightMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"},
				{
					"position": "BottomCenter",
					"source": true,
					"target": false,
					"color": "#FF0",
					"shape": "Dot"
				}
				// {"position":"LeftMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"}
			],
			"setOptions": [{
				"value": "1",
				"text": "开"
			}, {
				"value": "0",
				"text": "关"
			}]
		},
		//按键
		"flowchart_button_item": {
			"className": "flowchart-button-item",
			"name": "button",
			"unique": false,
			"type": "button",
			"kind": "flowchart",
			"desc": "",
			"points": [{
					"position": "TopCenter",
					"source": false,
					"target": true,
					"color": "#FF8891",
					"shape": "Dot"
				},
				// {"position":"RightMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"},
				{
					"position": "BottomCenter",
					"source": true,
					"target": false,
					"color": "#FF0",
					"shape": "Dot"
				},
				// {"position":"LeftMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"}
			]
		},
		//转接板开关
		"flowchart_zjbkg_item": {
			"className": "flowchart-zjbkg-item",
			"name": "zjbkg",
			"unique": false,
			"type": "zjbkg",
			"kind": "flowchart",
			"desc": "",
			"points": [{
					"position": "TopCenter",
					"source": false,
					"target": true,
					"color": "#FF8891",
					"shape": "Dot"
				},
				// {"position":"RightMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"},
				{
					"position": "BottomCenter",
					"source": true,
					"target": false,
					"color": "#FF0",
					"shape": "Dot"
				},
				// {"position":"LeftMiddle","source":true,"target":true,"color":"#F0F","shape":"Dot"}
			]
		},
		//条件分支
		"flowchart_tjfz_item": {
			"className": "flowchart-tjfz-item",
			"name": "tjfz",
			"unique": false,
			"type": "if",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "RightMiddle",
				"source": true,
				"color": "#FF0",
				"shape": "Dot"
			}]
		},
		//条件分支合并节点
		"flowchart_tjfzMerge_item": {
			"className": "flowchart-tjfz-item",
			"name": "tjfzMerge",
			"unique": false,
			"type": "tjfzMerge",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "RightMiddle",
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"color": "#FF0",
				"shape": "Dot"
			}]
		},
		//条件循环
		"flowchart_tjxh_item": {
			"className": "flowchart-tjxh-item",
			"name": "tjxh",
			"unique": false,
			"type": "loop",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "RightMiddle",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "LeftMiddle",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}]
		},
		//永远循环
		"flowchart_yyxh_item": {
			"className": "flowchart-yyxh-item",
			"name": "yyxh",
			"unique": false,
			"type": "loop",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "RightMiddle",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "LeftMiddle",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}]
		},
		//计数循环
		"flowchart_jsxh_item": {
			"className": "flowchart-jsxh-item",
			"name": "jsxh",
			"unique": false,
			"type": "loop",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "RightMiddle",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, {
				"position": "LeftMiddle",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}]
		},
		//延时函数
		"flowchart_yshs_item": {
			"className": "flowchart-yshs-item",
			"name": "yshs",
			"unique": false,
			"type": "op",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ],
			"add_info": {
				"params": [{
					"name": "time",
					"title": "时间"
				}],
				"format": "delay_ms(time)"
			}
		},
		//定时函数
		"flowchart_dshs_item": {
			"className": "flowchart-dshs-item",
			"name": "dshs",
			"unique": false,
			"type": "op",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ]
		},
		//赋值函数
		"flowchart_fzhs_item": {
			"className": "flowchart-fzhs-item",
			"name": "fzhs",
			"unique": false,
			"type": "op",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ],
			"add_info": {
				"params": [{
					"name": "left",
					"title": "左边"
				},{
					"name": "right",
					"title": "右边"
				}],
				"format": "left = right"
			}
		},
		//随机函数
		"flowchart_sjhs_item": {
			"className": "flowchart-sjhs-item",
			"name": "sjhs",
			"unique": false,
			"type": "op",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ]
		},
		//自定义函数
		"flowchart_zdyhs_item": {
			"className": "flowchart-zdyhs-item",
			"name": "zdyhs",
			"unique": false,
			"type": "op",
			"kind": "flowchart",
			"desc": "",
			"points": [{
				"position": "TopCenter",
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": "BottomCenter",
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ]
		},
		// 主板
		"hardware_board_item": {
			"className": "hardware-board-item",
			"name": "board",
			"unique": true,
			"type": "board",
			"kind": "hardware",
			"desc": "",
			"points": [{
				"position": [0.16, 0.05, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "A0"
			}, {
				"position": [0.34, 0.05, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "B0"
			}, {
				"position": [0.66, 0.05, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "C0"
			}, {
				"position": [0.84, 0.05, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "D0"
			}, {
				"position": [0.16, 0.95, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "E0"
			}, {
				"position": [0.34, 0.95, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "F0"
			}, {
				"position": [0.66, 0.95, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "G0"
			}, {
				"position": [0.84, 0.95, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Rectangle",
				"port": "H0"
			}, ]
		},
		//LED灯
		"hardware_light_item": {
			"className": "hardware-light-item",
			"name": "light",
			"unique": false,
			"type": "light",
			"kind": "hardware",
			"needsPinboard": 1,
			"desc": "",
			"points": [{
				"position": [0.5, 0.05, 0, 0],
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, ],
			"setOptions": [{
				"value": "1",
				"text": "开"
			}, {
				"value": "0",
				"text": "关"
			}]
		},
		//LED等转接口,LED等必须接在这个转接口上
		"hardware_adapter_item": {
			"className": "hardware-adapter-item",
			"name": "adapter",
			"unique": false,
			"type": "adapter",
			"kind": "hardware",
			"desc": "",
			"points": [{
				"position": [0.5, 0.05, 0, 0],
				"source": false,
				"target": true,
				"color": "#FF8891",
				"shape": "Dot"
			}, {
				"position": [0.5, 0.95, 0, 0],
				"source": true,
				"target": false,
				"color": "#FF0",
				"shape": "Dot"
			}, ]
		}
	};

	// 获取控制器
	function getControllerItems() {
		$.ajax({
			type: "GET",
			//url: "./GetFlowchartItem.php",
			url : "/flowchart/item",
			data: "",
			dataType: "json",
			async: false, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				// console.log(result);
				// 控制器规则生成
				var arrController = result.controller;
				for (var i = 0; i < arrController.length; i++) {
					arrController[i]['className'] = "hardware-" + arrController[i]['name'] + "-item";
					data["hardware_" + arrController[i]['name'] + "_item"] = arrController[i];
				}
				// 连线规则生成
				var arrRule = result.rule;
				for (var i = 0; i < arrRule.length; i++) {
					arrRule[i]['className'] = "hardware-" + arrRule[i]['name'] + "-item";
					data["hardware_" + arrRule[i]['name'] + "_item"] = arrRule[i];
				}
				// 流程图元素生成
				var arrFlowchart = result.flowchart;
				for (var i = 0; i < arrFlowchart.length; i++) {
					arrFlowchart[i]['className'] = "flowchart-" + arrFlowchart[i]['name'] + "-item";
					data["flowchart_" + arrFlowchart[i]['name'] + "_item"] = arrFlowchart[i];
				}
			}
		});
	}

	function getResult() {
		// console.log(data);
		getControllerItems();
		// console.log(data);
		return data;
	}

	return getResult();
});