define(function() {
	//硬件配置
	var hardwares = {
		//主板
		"board": {
			tag: 0,
			type: "board",
			alias: "主板",
			deletable: false,
			selectionAdorned: false,
			isController: true,
			width: 300,
			height: 184,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			category: "board",
		},

		//转接口
		"adapter": {
			tag: 0,
			type: "adapter",
			alias: "转接器",
			selectionAdorned: false,
			deletable: false,
			width: 36,
			height: 36,
			category: "adapter",
		},

		//输入模块
		//按键
		"button": {
			tag: 1,
			alias: "按键",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//开关
		"switch": {
			tag: 1,
			alias: "开关",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//行程开关
		"travelSwitch": {
			tag: 1,
			alias: "行程开关",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
			inUse: false,
		},
		//巡线
		"linePatrol": {
			tag: 1,
			alias: "巡线",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//火焰D
		"fireD": {
			tag: 1,
			alias: "火焰D",
			width: 43,
			height: 78,
			inUse: false,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//红外接收
		"infraredIn": {
			tag: 1,
			alias: "红外接收",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//声音传感
		"soundSensor": {
			tag: 1,
			alias: "声音传感",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//倾斜
		"lean": {
			tag: 1,
			alias: "倾斜",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//金属接近
		"metalClose": {
			tag: 1,
			alias: "金属接近",
			inUse: false,
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//1位I/O输入
		"oneBitIn": {
			tag: 1,
			alias: "1位I/O输入",
			inUse: false,
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//巡线阵列
		"linePatrolRow": {
			tag: 1,
			alias: "巡线阵列",
			width: 100,
			height: 80,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
			needBit: 8,
		},
		//矩阵键盘
		"keyboard": {
			tag: 1,
			alias: "矩阵键盘",
			width: 100,
			height: 80,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
			needBit: 8,
		},
		//输出模块
		//LED灯
		"light": {
			tag: 2,
			alias: "灯",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//继电器
		"relay": {
			tag: 2,
			alias: "继电器",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//蜂鸣器
		"buzzer": {
			tag: 2,
			alias: "蜂鸣器",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//红外发射
		"infraredOut": {
			tag: 2,
			alias: "红外发射",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//1位I/O输出
		"oneBitOut": {
			tag: 2,
			alias: "1位I/O输出",
			width: 43,
			height: 78,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needPinboard: true,
		},
		//数码管
		"digitalTube": {
			tag: 2,
			alias: "数码管",
			width: 100,
			height: 80,
			port: "11111111 11111111 11111111 11111111 11111111 11111111 11111000 00000000",
			needBit: 8,
		},

		//执行模块
		//舵机
		"streeringEngine": {
			tag: 3,
			alias: "舵机",
			width: 90,
			height: 150,
			port: "00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000",
			needBit: 8,
			needDriveplate: true,
			max: 2,
		},
		//直流电机
		"dcMotor": {
			tag: 3,
			alias: "直流电机",
			width: 87,
			height: 90,
			port: "00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000",
			needBit: 8,
			needDriveplate: true,
			max: 2,
		},

		//传感模块
		//光照
		"illumination": {
			tag: 4,
			alias: "光照",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//温度
		"temperatue": {
			tag: 4,
			alias: "温度",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//湿度
		"humidity": {
			tag: 4,
			alias: "湿度",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//PM2.5
		"pm25": {
			tag: 4,
			alias: "PM2.5",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//火焰A
		"fireA": {
			tag: 4,
			alias: "火焰A",
			inUse: false,
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//AD输入
		"ad": {
			tag: 4,
			alias: "AD输入",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
			needPinboard: true,
		},
		//超声测距
		"ultrasoundLocation": {
			tag: 4,
			alias: "超声测距",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},
		//电子罗盘
		"electronicCompass": {
			tag: 4,
			alias: "电子罗盘",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},

		//其它
		//串口输入
		"serialPortIn": {
			tag: 5,
			alias: "串口输入",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 11000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},
		//串口输出
		"serialPortOut": {
			tag: 5,
			alias: "串口输出",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 00000000 11000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},

		//IIC输入
		"iicIn": {
			tag: 5,
			alias: "IIC输入",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},
		//IIC输出
		"iicOut": {
			tag: 5,
			alias: "IIC输出",
			width: 43,
			height: 78,
			port: "00000000 00000000 00000000 11000000 00000000 00000000 00000000 00000000",
			needPinboard: true,
			needBit: 2,
		},
	};

	//流程图配置
	var softwares = {
		"start": {
			tag: 1,
			subTag: 1,
			alias: "开始",
			width: 75,
			height: 26,
			deletable: false,
			category: "start",
		},
		"loopStart": {
			tag: 1,
			subTag: 2,
			alias: "loop开始",
			width: 75,
			height: 26,
			deletable: false,
			category: "loopStart",
		},
		"loopEnd": {
			tag: 1,
			subTag: 3,
			alias: "loop结束",
			width: 75,
			height: 26,
			deletable: false,
			category: "loopEnd",
		},
		"end": {
			tag: 1,
			subTag: 4,
			alias: "结束",
			width: 75,
			height: 26,
			deletable: false,
			category: "end",
		},

		"ifElse": {
			tag: 2,
			subTag: 1,
			alias: "条件分支",
			width: 75,
			height: 26,
			category: "ifElse",
			format: "if(condition)",
			params: [{
				name: "condition",
				title: "分支条件",
				inputType: "text",
				defaultValue: "Condition",
			}],
		},
		"conditionLoop": {
			tag: 2,
			subTag: 2,
			alias: "条件循环",
			width: 75,
			height: 26,
			category: "while",
			format: "while(condition)",
			params: [{
				name: "condition",
				title: "循环条件",
				inputType: "text",
				defaultValue: "Condition",
			}],
		},
		"foreverLoop": {
			tag: 2,
			subTag: 2,
			alias: "永远循环",
			width: 75,
			height: 26,
			category: "while",
			format: "for(;;)",
		},
		"countLoop": {
			tag: 2,
			subTag: 2,
			alias: "计数循环",
			width: 75,
			height: 26,
			category: "while",
			format: "for(int index = 0; index < count; index++)",
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
		},

		"delay": {
			tag: 3,
			alias: "延时函数",
			width: 75,
			height: 26,
			format: "delay_ms(time);",
			params: [{
				name: "time",
				title: "延时",
				inputType: "text",
				defaultValue: "1000",
				inputHolder: "毫秒",
			}],
		},
		"assignment": {
			tag: 3,
			alias: "赋值函数",
			width: 75,
			height: 26,
			format: "var = exp;",
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
		},

		"board": {
			tag: 4,
			alias: "主板",
			width: 36,
			height: 36,
		},

		//输入模块
		//按键
		"button": {
			tag: 4,
			alias: "按键",
			width: 36,
			height: 36,
			format: "value = IoInB(port, bit);",
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
		},
		//开关
		"switch": {
			tag: 4,
			alias: "开关",
			width: 36,
			height: 36,
			format: "value = IoInB(port, bit);",
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
		},
		//行程开关
		"travelSwitch": {
			tag: 4,
			alias: "行程开关",
			width: 36,
			height: 36,
			format: "value = IoInB(port, bit);",
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
		},
		//巡线
		"linePatrol": {
			tag: 4,
			alias: "巡线",
			width: 36,
			height: 36,
			format: "value = IoInB(port, bit);",
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
		},
		//火焰D
		"fireD": {
			tag: 4,
			alias: "火焰D",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "红外接收",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "声音传感",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "倾斜",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "金属接近",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "1位I/O输入",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "矩阵键盘",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "LED灯",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "继电器",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "蜂鸣器",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "红外发射",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "1位I/O输出",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "数码管",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "舵机",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "直流电机",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "光照",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "温度",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "湿度",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "PM2.5",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "火焰A",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "AD输入",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "串口输入",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "串口输出",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "超声测距",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "电子罗盘",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "IIC输入",
			width: 36,
			height: 36,
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
			tag: 4,
			alias: "IIC输出",
			width: 36,
			height: 36,
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
	};

	function parse() {
		for(var name in hardwares){
			var config = hardwares[name];
			config.name = name;
			config.category = config.category || "";
			config.source = "assets/images/hardware/" + name + ".png";
			config.location = "0 0";
			config.inUse = config.inUse === undefined ? true : config.inUse;
			config.deletable = config.deletable === undefined ? true: config.deletable;
			config.isController = config.isController || false;
			config.needBit = config.needBit || 1;
			config.needPinboard = config.needPinboard || false;
			config.needDriveplate = config.needDriveplate || false;
			config.max = config.max || 0;
			config.textVisible = false;
			config.angle = 0;
			config.port = config.port || "";
		}

		for(var name in softwares){
			var config = softwares[name];
			config.name = name;
			config.category = config.category || "";
			if(config.tag >= 4) {
				config.source = "assets/images/hardware/" + name + "-small.png";
			} else {
				config.source = "assets/images/software/" + name + ".png";
			}
			config.location = "0 0";
			config.deletable = config.deletable === undefined ? true: config.deletable;
			config.textVisible = config.tag < 4;
			config.angle = 0;
		}

		return {
			hardwares: hardwares,
			softwares: softwares,
		};
	}
	
	return parse();
});