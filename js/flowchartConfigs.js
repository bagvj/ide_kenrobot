define(function() {
	/*
	 * 流程图模块配置
	 */
	var configs = {
		//特殊模块：开始、结束
		//开始
		"start": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 1,
		},
		//结束
		"end": {
			"type": 2,
		},


		//流程控制模块：if-else、while、for
		//条件循环
		"tjxh": {
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": "RightMiddle",
			"type": 3,
			"subType": 1,
			"params": [{
				"name": "condition",
				"title": "循环条件",
				"inputType": "text",
				"defaultValue": "Condition",
			}],
			"format": "while(condition)"
		},
		//永远循环
		"yyxh": {
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": "RightMiddle",
			"type": 3,
			"subType": 1,
			"format": "for(;;)"
		},
		//计数循环
		"jsxh": {
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": "RightMiddle",
			"type": 3,
			"subType": 1,
			"params": [{
				"name": "count",
				"title": "循环条件",
				"inputType": "text",
				"defaultValue": "1",
			}],
			"format": "for(unsigned int count = )"
		},
		//条件分支
		"tjfz": {
			"head": "TopCenter",
			"foot": ["LeftMiddle", "RightMiddle"],
			"type": 3,
			"subType": 2,
			"params": [{
				"name": "condition",
				"title": "分支条件",
				"inputType": "text",
				"defaultValue": "Condition",
			}],
			"format": "if(condition)"
		},


		//硬件模块：LED灯、开关、传感器
		//输入模块
		//LED灯
		"light": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 4,
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
				"title": "1亮/0灭",
				"inputType": "text",
				"defaultValue": "Value",
			}],
			"format": "IoOutB(port, bit, value);",
		},
		//数码管
		"digitalTube": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 4,
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
		//输出模块
		//开关
		"switch": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 4,
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
				"defaultValue": "Value",
			}],
			"format": "value = IoInB(port, bit);",
		},
		//执行模块
		//直流电机
		"dcMotor": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 4,
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
			},],
			"format": "DCMotor(index, rotation);",
			"initFormat": "InitMotor();"
		},
		
		//传感模块


		//函数模块：延时、定时
		//延时函数
		"yshs": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 5,
			"params": [{
				"name": "time",
				"title": "延时(毫秒)",
				"inputType": "text",
				"defaultValue": "1000",
			}],
			"format": "delay_ms(time);",
		},
		//赋值函数
		"fzhs": {
			"head": "TopCenter",
			"foot": "BottomCenter",
			"type": 5,
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
		}
	}

	return configs;
})