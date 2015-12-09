define(function() {
	/*
	 * 硬件配置
	 */
	var hardwares = {
		//主板
		"board": {
			type: "board",
			id: 1,
			unique: true,
			alias: "主板",
			always: true,
			points: [{
				position: [0.182, 0.059],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "A",
				bit: "11111111",
			}, {
				position: [0.352, 0.059],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "B",
				bit: "11111111",
			}, {
				position: [0.662, 0.059],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "C",
				bit: "11111111",
			}, {
				position: [0.833, 0.059],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "D",
				bit: "11111111",
			}, {
				position: [0.662, 0.946],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "F",
				bit: "11111111",
			}, {
				position: [0.833, 0.946],
				source: true,
				color: "#333",
				shape: ["Rectangle", {
					width: 12,
					height: 20
				}],
				port: "E",
				bit: "11111111",
			}, ],
		},

		"adapter": {
			type: "adapter",
			alias: "转接器",
			points: [{
				position: [0.5, 0.05],
				source: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},

		//输入模块
		//按键
		"button": {
			category: 1,
			alias: "按键",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//开关
		"switch": {
			category: 1,
			alias: "开关",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//行程开关
		"travelSwitch": {
			category: 1,
			alias: "行程开关",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			inUse: false,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//巡线
		"linePatrol": {
			category: 1,
			alias: "巡线",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//火焰D
		"fireD": {
			category: 1,
			alias: "火焰D",
			inUse: false,
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//红外接收
		"infraredIn": {
			category: 1,
			alias: "红外接收",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//声音传感
		"soundSensor": {
			category: 1,
			alias: "声音传感",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//倾斜
		"lean": {
			category: 1,
			alias: "倾斜",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//金属接近
		"metalClose": {
			category: 1,
			alias: "金属接近",
			inUse: false,
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//1位I/O输入
		"oneBitIn": {
			category: 1,
			alias: "1位I/O输入",
			inUse: false,
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//巡线阵列
		"linePatrolRow": {
			category: 1,
			alias: "巡线阵列",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			bits: 8,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//矩阵键盘
		"keyboard": {
			category: 1,
			alias: "矩阵键盘",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			bits: 8,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//输出模块
		//LED灯
		"light": {
			category: 2,
			alias: "灯",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//继电器
		"relay": {
			category: 2,
			alias: "继电器",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//蜂鸣器
		"buzzer": {
			category: 2,
			alias: "蜂鸣器",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//红外发射
		"infraredOut": {
			category: 2,
			alias: "红外发射",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//1位I/O输出
		"oneBitOut": {
			category: 2,
			alias: "1位I/O输出",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//数码管
		"digitalTube": {
			category: 2,
			alias: "数码管",
			port: "1111111111111111111111111111111100000000111111111111111111111111",
			bits: 8,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},

		//执行模块
		//舵机
		"streeringEngine": {
			category: 3,
			alias: "舵机",
			port: "0000000011111111000000000000000000000000000000000000000000000000",
			bits: 8,
			needDriveplate: true,
			max: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//直流电机
		"dcMotor": {
			category: 3,
			alias: "直流电机",
			port: "0000000011111111000000000000000000000000000000000000000000000000",
			bits: 8,
			needDriveplate: true,
			max: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},

		//传感模块
		//光照
		"illumination": {
			category: 4,
			alias: "光照",
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//温度
		"temperatue": {
			category: 4,
			alias: "温度",
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//湿度
		"humidity": {
			category: 4,
			alias: "湿度",
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//PM2.5
		"pm25": {
			category: 4,
			alias: "PM2.5",
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//火焰A
		"fireA": {
			category: 4,
			alias: "火焰A",
			inUse: false,
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//AD输入
		"ad": {
			category: 4,
			alias: "AD输入",
			port: "0000000000000000000000000000000000000000111111110000000000000000",
			needPinboard: true,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//超声测距
		"ultrasoundLocation": {
			category: 4,
			alias: "超声测距",
			port: "0000000000000000000000001100000000000000000000000000000000000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//电子罗盘
		"electronicCompass": {
			category: 4,
			alias: "电子罗盘",
			port: "0000000000000000000000001100000000000000000000000000000000000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},

		//其它
		//串口输入
		"serialPortIn": {
			category: 5,
			alias: "串口输入",
			port: "0000000000000000000000000000000000000000000000000000000011000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//串口输出
		"serialPortOut": {
			category: 5,
			alias: "串口输出",
			port: "0000000000000000000000000000000000000000000000000000000011000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},

		//IIC输入
		"iicIn": {
			category: 5,
			alias: "IIC输入",
			port: "0000000000000000000000001100000000000000000000000000000000000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
		//IIC输出
		"iicOut": {
			category: 5,
			alias: "IIC输出",
			port: "0000000000000000000000001100000000000000000000000000000000000000",
			needPinboard: true,
			bits: 2,
			points: [{
				position: [0.5, 0.95],
				target: true,
				color: "#FF0",
				shape: "Dot"
			}, ],
		},
	};

	/*
	 * 流程图配置
	 */
	var flowcharts = {
		//特殊模块：开始、结束
		//开始
		"start": {
			tag: 1,
			subTag: 1,
			className: "oval",
			unique: true,
			always: true,
			points: [{
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}]
		},
		//loop开始
		"loopStart": {
			tag: 1,
			subTag: 2,
			className: "oval",
			unique: true,
			always: true,
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "LeftMiddle",
				color: "#CCC",
				shape: "Dot"
			}]
		},
		//loop结束
		"loopEnd": {
			tag: 1,
			subTag: 3,
			className: "oval",
			unique: true,
			always: true,
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				color: "#CCC",
				shape: "Dot"
			}, {
				position: "LeftMiddle",
				color: "#CCC",
				shape: "Dot"
			}]
		},
		//结束
		"end": {
			tag: 1,
			subTag: 4,
			className: "oval",
			always: true,
			points: [{
				position: "TopCenter",
				color: "#CCC",
				shape: "Dot"
			}]
		},

		//流程控制模块：if-else、while、for
		//条件循环
		"tjxh": {
			tag: 2,
			subTag: 1,
			params: [{
				name: "condition",
				title: "循环条件",
				inputType: "text",
				defaultValue: "Condition",
			}],
			format: "while(condition)",
			type: "loop",
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "RightMiddle",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "LeftMiddle",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}]
		},
		//永远循环
		"yyxh": {
			tag: 2,
			subTag: 1,
			format: "for(;;)",
			type: "loop",
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "RightMiddle",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "LeftMiddle",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}]
		},
		//计数循环
		"jsxh": {
			tag: 2,
			subTag: 1,
			params: [{
				name: "index",
				title: "循环变量",
				inputType: "text",
				defaultValue: "i",
			}, {
				name: "count",
				title: "循环次数",
				inputType: "text",
				inputHolder: "数字或者变量",
				defaultValue: "5",
			}],
			format: "for(int index = 0; index < count; index++)",
			type: "loop",
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "RightMiddle",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "LeftMiddle",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}]
		},
		//条件分支
		"tjfz": {
			tag: 2,
			subTag: 2,
			params: [{
				name: "condition",
				title: "分支条件",
				inputType: "text",
				defaultValue: "Condition",
			}],
			format: "if(condition)",
			type: "if",
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}, {
				position: "RightMiddle",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}]
		},
		//条件分支合并节点
		"tjfzMerge": {
			tag: 2,
			subTag: 3,
			className: "tjfz",
			points: [{
				position: "TopCenter",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "RightMiddle",
				target: true,
				color: "#FF8891",
				shape: "Dot"
			}, {
				position: "BottomCenter",
				source: true,
				color: "#FF0",
				shape: "Dot"
			}]
		},

		"board": {
			tag: 3,
		},

		//输入模块
		//按键
		"button": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Key",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//开关
		"switch": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Switch",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//行程开关
		"travelSwitch": {
			tag: 3,
			inUse: false,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "TravelSwitch",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//巡线
		"linePatrol": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Line",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//火焰D
		"fireD": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "FlameDigital",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//红外接收
		"infraredIn": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "InfraredReception",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//声音传感
		"soundSensor": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Voice",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//倾斜
		"lean": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Lean",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//金属接近
		"metalClose": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Metal",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//1位I/O输入
		"oneBitIn": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Value",
				increase: true,
			}],
			format: "value = IoInB(port, bit);",
		},
		//矩阵键盘
		"keyboard": {
			tag: 3,
			initParams: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}],
			format: "KeyScan();",
			initFormat: "initKdm(port);"
		},
		//输出模块
		//LED灯
		"light": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				inputHolder: "1亮/0灭",
				defaultValue: "1",
			}],
			format: "IoOutB(port, bit, value);",
		},
		//继电器
		"relay": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "1",
			}],
			format: "IoOutB(port, bit, value);",
		},
		//蜂鸣器
		"buzzer": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "输出值(0/1)",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "1",
			}],
			format: "IoOutB(port, bit, value);",
		},
		//红外发射
		"infraredOut": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "1",
			}],
			format: "IoOutB(port, bit, value);",
		},
		//1位I/O输出
		"oneBitOut": {
			tag: 3,
			params: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}, {
				name: "bit",
				title: "位",
				inputType: "text",
				defaultValue: "Bit",
				autoSet: true
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "1",
			}],
			format: "IoOutB(port, bit, value);",
		},
		//数码管
		"digitalTube": {
			tag: 3,
			params: [{
				name: "num",
				title: "显示数值",
				inputType: "text",
				defaultValue: "Num",
			}],
			initParams: [{
				name: "port",
				title: "端口",
				inputType: "text",
				defaultValue: "Port",
				autoSet: true
			}],
			format: "ToLed(num);",
			initFormat: "InitNumLed(port);"
		},

		//执行模块
		//舵机
		"streeringEngine": {
			tag: 3,
			params: [{
				name: "index",
				title: "编号",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "Index"
			}, {
				name: "degree",
				title: "转动角度",
				inputType: "text",
				inputHolder: "-90~90",
				defaultValue: "Degree"
			}],
			format: "Servo(index, degree);",
			initFormat: "InitServo();"
		},
		//直流电机
		"dcMotor": {
			tag: 3,
			params: [{
				name: "index",
				title: "编号",
				inputHolder: "0或1",
				inputType: "text",
				defaultValue: "Index",
			}, {
				name: "rotation",
				title: "转动量",
				inputType: "text",
				inputHolder: "-255~255",
				defaultValue: "Rotation",
			}],
			format: "DCMotor(index, rotation);",
			initFormat: "InitMotor();"
		},

		//传感模块
		//光照
		"illumination": {
			tag: 3,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Light",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},
		//温度
		"temperatue": {
			tag: 3,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Tem",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},
		//湿度
		"humidity": {
			tag: 3,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Tem",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},
		//PM2.5
		"pm25": {
			tag: 3,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "PM",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},
		//火焰A
		"fireA": {
			tag: 3,
			inUse: false,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "FlameAnalog",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},
		//AD输入
		"ad": {
			tag: 3,
			params: [{
				name: "bit",
				title: "位号",
				inputType: "text",
				defaultValue: "Bit",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "ADDefault",
				increase: true,
			}],
			format: "value = read_adc(bit);"
		},

		//其它
		//串口输入
		"serialPortIn": {
			tag: 3,
			params: [{
				name: "index",
				title: "串口号",
				inputType: "text",
				inputHolder: "0或1",
				defaultValue: "Index",
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "UARTInput",
				increase: true,
			}],
			initParams: [{
				name: "index",
				title: "串口号",
				inputHolder: "0或1",
				inputType: "text",
				defaultValue: "Index",
			}, {
				name: "baudRate",
				title: "波特率",
				inputType: "text",
				inputHolder: "0-5,分别表示4800,9600,19200,38400,57600,115200",
				defaultValue: "1",
			}, {
				name: "check",
				title: "校验位",
				inputType: "text",
				inputHolder: "0奇校验;1偶校验;2无校验",
				defaultValue: "2",
			}],
			format: "value = uGetChar(index);",
			initFormat: "uart_init(index, baudRate, check);"
		},
		//串口输出
		"serialPortOut": {
			tag: 3,
			params: [{
				name: "index",
				title: "串口号",
				inputHolder: "0或1",
				inputType: "text",
				defaultValue: "1",
				autoSet: true
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				defaultValue: "UARTOutput",
			}],
			initParams: [{
				name: "index",
				title: "串口号",
				inputHolder: "0或1",
				inputType: "text",
				defaultValue: "Index",
			}, {
				name: "baudRate",
				title: "波特率",
				inputType: "text",
				inputHolder: "0-5,分别表示4800,9600,19200,38400,57600,115200",
				defaultValue: "1",
			}, {
				name: "check",
				title: "校验位",
				inputType: "text",
				inputHolder: "0奇校验;1偶校验;2无校验",
				defaultValue: "2",
			}],
			format: "uPutChar(index, value);",
			initFormat: "uart_init(index, baudRate, check);"
		},
		//超声测距
		"ultrasoundLocation": {
			tag: 3,
			params: [{
				name: "arg",
				title: "参数",
				inputType: "text",
				defaultValue: "240",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "Ultrasound",
				increase: true,
			}],
			initParams: [{
				name: "register",
				title: "波特率寄存器",
				inputType: "text",
				inputHolder: "0-1023",
				defaultValue: "Register",
			}, {
				name: "preFeequency",
				title: "预分频",
				inputType: "text",
				inputHolder: "0-3,分别表示1,4,16,64",
				defaultValue: "PreFeequency",
			}],
			format: "value = i2c_Ultr_Rag(arg);",
			initFormat: "twi_master_init(register, preFeequency);"
		},
		//电子罗盘
		"electronicCompass": {
			tag: 3,
			params: [{
				name: "arg",
				title: "参数",
				inputType: "text",
				defaultValue: "254",
				autoSet: true
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "EleCompass",
				increase: true,
			}],
			initParams: [{
				name: "register",
				title: "波特率寄存器",
				inputType: "text",
				inputHolder: "0-1023",
				defaultValue: "Register",
			}, {
				name: "preFeequency",
				title: "预分频",
				inputType: "text",
				inputHolder: "0-3,分别表示1,4,16,64",
				defaultValue: "PreFeequency",
			}],
			format: "value = i2c_Compass(arg);",
			initFormat: "twi_master_init(register, preFeequency);"
		},
		//IIC输入
		"iicIn": {
			tag: 3,
			params: [{
				name: "arg",
				title: "参数",
				inputType: "text",
				defaultValue: "Add"
			}, {
				name: "value",
				title: "读取到变量",
				inputType: "text",
				defaultValue: "I2CInput",
				increase: true,
			}],
			initParams: [{
				name: "register",
				title: "波特率寄存器",
				inputType: "text",
				inputHolder: "0-1023",
				defaultValue: "Register",
			}, {
				name: "preFeequency",
				title: "预分频",
				inputType: "text",
				inputHolder: "0-3,分别表示1,4,16,64",
				defaultValue: "PreFeequency",
			}],
			format: "value = i2c_maste_read(arg);",
			initFormat: "twi_master_init(register, preFeequency);"
		},
		//IIC输出
		"iicOut": {
			tag: 3,
			params: [{
				name: "arg",
				title: "参数",
				inputType: "text",
				defaultValue: "Add"
			}, {
				name: "value",
				title: "输出值",
				inputType: "text",
				defaultValue: "Value",
			}],
			initParams: [{
				name: "register",
				title: "波特率寄存器",
				inputType: "text",
				inputHolder: "0-1023",
				defaultValue: "Register",
			}, {
				name: "preFeequency",
				title: "预分频",
				inputType: "text",
				inputHolder: "0-3,分别表示1,4,16,64",
				defaultValue: "PreFeequency",
			}],
			format: "i2c_maste_transt(arg, value);",
			initFormat: "twi_master_init(register, preFeequency);"
		},

		//函数模块：延时、定时
		//延时函数
		"yshs": {
			tag: 4,
			params: [{
				name: "time",
				title: "延时",
				inputType: "text",
				defaultValue: "1000",
				inputHolder: "毫秒",
			}],
			format: "delay_ms(time);",
		},
		//赋值函数
		"fzhs": {
			tag: 4,
			params: [{
				name: "var",
				title: "变量",
				inputType: "text",
				defaultValue: "Var",
			}, {
				name: "exp",
				title: "表达式",
				inputType: "text",
				defaultValue: "Exp",
			}],
			format: "var = exp;",
		}
	}

	function parse() {
		for (var name in hardwares) {
			var hardware = hardwares[name];
			hardware.name = name;
			hardware.tips = hardware.tips || hardware.alias;
			hardware.type = hardware.type || name;
			hardware.unique = hardware.unique || false;
			hardware.always = hardware.always || false;
			hardware.desc = hardware.desc || "";
			hardware.className = "hardware-" + (hardware.className || name) + "-item";
			hardware.category = hardware.category || 0;
			hardware.inUse = hardware.inUse === undefined ? true : hardware.inUse;

			if (hardware.type == "board") {
				hardware.isController = true;
			} else {
				hardware.isController = false;
				hardware.bits = hardware.bits || 1;
				hardware.needPinboard = hardware.needPinboard || false;
				hardware.needDriveplate = hardware.needDriveplate || false;
				hardware.max = hardware.max || 0;
			}

			var points = hardware.points
			if (points) {
				for (var i = 0; i < points.length; i++) {
					var point = points[i];
					point.source = point.source || false;
					point.target = point.target || false;
				}
			}
		}

		for (var name in flowcharts) {
			var flowchart = flowcharts[name];
			flowchart.name = name;
			flowchart.tips = flowchart.tips || flowchart.name;
			flowchart.type = flowchart.type || name;
			flowchart.unique = flowchart.unique || false;
			flowchart.always = flowchart.always || false;
			flowchart.className = "flowchart-" + (flowchart.className || name) + "-item";
			flowchart.desc = flowchart.desc || "";

			var points = flowchart.points;
			if (!points) {
				points = [{
					position: "TopCenter",
					target: true,
					color: "#FF8891",
					shape: "Dot"
				}, {
					position: "BottomCenter",
					source: true,
					color: "#FF0",
					shape: "Dot"
				}];
				flowchart.points = points;
			}

			for (var i = 0; i < points.length; i++) {
				var point = points[i];
				point.source = point.source || false;
				point.target = point.target || false;
			}

			var params = flowchart.params;
			if(params) {
				for (var i = 0; i < params.length; i++) {
					var param = params[i];
					param.increase = param.increase || false;
				}
			}
		}

		return {
			hardwares: hardwares,
			flowcharts: flowcharts,
		}
	}

	return parse();
})
