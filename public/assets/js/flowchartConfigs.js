define(function() {
	/*
	 * 流程图模块配置
	 */
	var configs = {
		//特殊模块：开始、结束
		//开始
		"start": {
			"tag": 1,
			"subTag": 1,
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
		"loopStart": {
			"tag": 1,
			"subTag": 2,
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
		"loopEnd": {
			"tag": 1,
			"subTag": 3,
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
		"end": {
			"tag": 1,
			"subTag": 4,
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

		//流程控制模块：if-else、while、for
		//条件循环
		"tjxh": {
			"tag": 2,
			"subTag": 1,
			"params": [{
				"name": "condition",
				"title": "循环条件",
				"inputType": "text",
				"defaultValue": "Condition",
			}],
			"format": "while(condition)",
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
		"yyxh": {
			"tag": 2,
			"subTag": 1,
			"format": "for(;;)",
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
		"jsxh": {
			"tag": 2,
			"subTag": 1,
			"params": [{
				"name": "index",
				"title": "循环变量",
				"inputType": "text",
				"defaultValue": "i",
			}, {
				"name": "count",
				"title": "循环次数",
				"inputType": "text",
				"inputHolder": "数字或者变量",
				"defaultValue": "5",
			}],
			"format": "for(int index = 0; index < count; index++)",
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
		//条件分支
		"tjfz": {
			"tag": 2,
			"subTag": 2,
			"params": [{
				"name": "condition",
				"title": "分支条件",
				"inputType": "text",
				"defaultValue": "Condition",
			}],
			"format": "if(condition)",
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
		"tjfzMerge": {
			"tag": 2,
			"subTag": 3,
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

		//硬件模块：LED灯、开关、传感器
		//输入模块
		//按键
		"button": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Key",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//开关
		"switch": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Switch",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//行程开关
		"travelSwitch": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "TravelSwitch",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//巡线
		"linePatrol": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Line",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//火焰D
		"fireD": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "FlameDigital",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//火焰D
		"fireD": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "FlameDigital",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//红外接收
		"infraredIn": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "InfraredReception",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//声音传感
		"soundSensor": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Voice",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//倾斜
		"lean": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Lean",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//金属接近
		"metalClose": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Metal",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//矩阵键盘
		"keyboard": {
			"tag": 3,
			"initParams": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}],
			"format": "KeyScan();",
			"initFormat": "initKdm(port);"
		},
		//输出模块
		//LED灯
		"light": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"inputHolder": "1亮/0灭",
				"defaultValue": "1",
			}],
			"format": "IoOutB(port, bit, value);",
		},
		//继电器
		"relay": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"inputHolder": "0或1",
				"defaultValue": "1",
			}],
			"format": "IoOutB(port, bit, value);",
		},
		//蜂鸣器
		"buzzer": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "输出值(0/1)",
				"inputType": "text",
				"inputHolder": "0或1",
				"defaultValue": "1",
			}],
			"format": "IoOutB(port, bit, value);",
		},
		//红外发射
		"infraredOut": {
			"tag": 3,
			"params": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}, {
				"name": "bit",
				"title": "位",
				"inputType": "text",
				"defaultValue": "Bit",
				"autoSet": true
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"inputHolder": "0或1",
				"defaultValue": "1",
			}],
			"format": "IoOutB(port, bit, value);",
		},
		//数码管
		"digitalTube": {
			"tag": 3,
			"params": [{
				"name": "num",
				"title": "显示数值",
				"inputType": "text",
				"defaultValue": "Num",
			}],
			"initParams": [{
				"name": "port",
				"title": "端口",
				"inputType": "text",
				"defaultValue": "Port",
				"autoSet": true
			}],
			"format": "ToLed(num);",
			"initFormat": "InitNumLed(port);"
		},

		//执行模块
		//舵机
		"streeringEngine": {
			"tag": 3,
			"params": [{
				"name": "index",
				"title": "编号",
				"inputType": "text",
				"inputHolder": "0或1",
				"defaultValue": "Index"
			}, {
				"name": "degree",
				"title": "转动角度",
				"inputType": "text",
				"inputHolder": "-90~90",
				"defaultValue": "Degree"
			}],
			"format": "Servo(index, degree);",
			"initFormat": "InitServo();"
		},
		//直流电机
		"dcMotor": {
			"tag": 3,
			"params": [{
				"name": "index",
				"title": "编号",
				"inputHolder": "0或1",
				"inputType": "text",
				"defaultValue": "Index",
			}, {
				"name": "rotation",
				"title": "转动量",
				"inputType": "text",
				"inputHolder": "-255~255",
				"defaultValue": "Rotation",
			}],
			"format": "DCMotor(index, rotation);",
			"initFormat": "InitMotor();"
		},

		//传感模块
		//光照
		"illumination": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Light",
			}],
			"format": "value = read_adc(bit);"
		},
		//温度
		"temperatue": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Tem",
			}],
			"format": "value = read_adc(bit);"
		},
		//湿度
		"humidity": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Tem",
			}],
			"format": "value = read_adc(bit);"
		},
		//PM2.5
		"pm25": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "PM25",
			}],
			"format": "value = read_adc(bit);"
		},
		//火焰A
		"fireA": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "FlameAnalog",
			}],
			"format": "value = read_adc(bit);"
		},
		//AD输入
		"ad": {
			"tag": 3,
			"params": [{
				"name": "bit",
				"title": "位号",
				"inputType": "text",
				"defaultValue": "Bit",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "ADDefault",
			}],
			"format": "value = read_adc(bit);"
		},

		//其它
		//串口输入
		"serialPortIn": {
			"tag": 3,
			"params": [{
				"name": "index",
				"title": "串口号",
				"inputType": "text",
				"inputHolder": "0或1",
				"defaultValue": "Index",
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "UARTInput",
			}],
			"initParams": [{
				"name": "index",
				"title": "串口号",
				"inputHolder": "0或1",
				"inputType": "text",
				"defaultValue": "Index",
			}, {
				"name": "baudRate",
				"title": "波特率",
				"inputType": "text",
				"inputHolder": "0-5,分别表示4800,9600,19200,38400,57600,115200",
				"defaultValue": "1",
			}, {
				"name": "check",
				"title": "校验位",
				"inputType": "text",
				"inputHolder": "0奇校验;1偶校验;2无校验",
				"defaultValue": "2",
			}],
			"format": "value = uGetChar(index);",
			"initFormat": "uart_init(index, baudRate, check);"
		},
		//串口输出
		"serialPortOut": {
			"tag": 3,
			"params": [{
				"name": "index",
				"title": "串口号",
				"inputHolder": "0或1",
				"inputType": "text",
				"defaultValue": "1",
				"autoSet": true
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"defaultValue": "UARTOutput",
			}],
			"initParams": [{
				"name": "index",
				"title": "串口号",
				"inputHolder": "0或1",
				"inputType": "text",
				"defaultValue": "Index",
			}, {
				"name": "baudRate",
				"title": "波特率",
				"inputType": "text",
				"inputHolder": "0-5,分别表示4800,9600,19200,38400,57600,115200",
				"defaultValue": "1",
			}, {
				"name": "check",
				"title": "校验位",
				"inputType": "text",
				"inputHolder": "0奇校验;1偶校验;2无校验",
				"defaultValue": "2",
			}],
			"format": "uPutChar(index, value);",
			"initFormat": "uart_init(index, baudRate, check);"
		},
		//超声测距
		"ultrasoundLocation": {
			"tag": 3,
			"params": [{
				"name": "arg",
				"title": "参数",
				"inputType": "text",
				"defaultValue": "240",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "Ultrasound",
			}],
			"initParams": [{
				"name": "register",
				"title": "波特率寄存器",
				"inputType": "text",
				"inputHolder": "0-1023",
				"defaultValue": "Register",
			}, {
				"name": "preFeequency",
				"title": "预分频",
				"inputType": "text",
				"inputHolder": "0-3,分别表示1,4,16,64",
				"defaultValue": "PreFeequency",
			}],
			"format": "value = i2c_Ultr_Rag(arg);",
			"initFormat": "twi_master_init(register, preFeequency);"
		},
		//电子罗盘
		"electronicCompass": {
			"tag": 3,
			"params": [{
				"name": "arg",
				"title": "参数",
				"inputType": "text",
				"defaultValue": "254",
				"autoSet": true
			}, {
				"name": "value",
				"title": "读取到变量",
				"inputType": "text",
				"defaultValue": "EleCompass",
			}],
			"initParams": [{
				"name": "register",
				"title": "波特率寄存器",
				"inputType": "text",
				"inputHolder": "0-1023",
				"defaultValue": "Register",
			}, {
				"name": "preFeequency",
				"title": "预分频",
				"inputType": "text",
				"inputHolder": "0-3,分别表示1,4,16,64",
				"defaultValue": "PreFeequency",
			}],
			"format": "value = i2c_Compass(arg);",
			"initFormat": "twi_master_init(register, preFeequency);"
		},
		//IIC输入
		"iicIn": {
			"tag": 3,
			"params": [{
				"name": "arg",
				"title": "参数",
				"inputType": "text",
				"defaultValue": "Add"
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"defaultValue": "I2CInput",
			}],
			"initParams": [{
				"name": "register",
				"title": "波特率寄存器",
				"inputType": "text",
				"inputHolder": "0-1023",
				"defaultValue": "Register",
			}, {
				"name": "preFeequency",
				"title": "预分频",
				"inputType": "text",
				"inputHolder": "0-3,分别表示1,4,16,64",
				"defaultValue": "PreFeequency",
			}],
			"format": "value = i2c_maste_read(arg);",
			"initFormat": "twi_master_init(register, preFeequency);"
		},
		//IIC输出
		"iicOut": {
			"tag": 3,
			"params": [{
				"name": "arg",
				"title": "参数",
				"inputType": "text",
				"defaultValue": "Add"
			}, {
				"name": "value",
				"title": "输出值",
				"inputType": "text",
				"defaultValue": "Value",
			}],
			"initParams": [{
				"name": "register",
				"title": "波特率寄存器",
				"inputType": "text",
				"inputHolder": "0-1023",
				"defaultValue": "Register",
			}, {
				"name": "preFeequency",
				"title": "预分频",
				"inputType": "text",
				"inputHolder": "0-3,分别表示1,4,16,64",
				"defaultValue": "PreFeequency",
			}],
			"format": "i2c_maste_transt(arg, value);",
			"initFormat": "twi_master_init(register, preFeequency);"
		},

		//函数模块：延时、定时
		//延时函数
		"yshs": {
			"tag": 4,
			"params": [{
				"name": "time",
				"title": "延时(毫秒)",
				"inputType": "text",
				"defaultValue": "1000",
			}],
			"format": "delay_ms(time);",
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
			}, ]
		},
		//赋值函数
		"fzhs": {
			"tag": 4,
			"params": [{
				"name": "var",
				"title": "变量",
				"inputType": "text",
				"defaultValue": "Var",
			}, {
				"name": "exp",
				"title": "表达式",
				"inputType": "text",
				"defaultValue": "Exp",
			}],
			"format": "var = exp;",
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
			}, ]
		}
	}

	return configs;
})
