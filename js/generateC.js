define(["jquery"], function($) {

	var codeContainerId;
	var data;
	var getFlowchartElements;
	var getNodeInfoByKey;
	//得到变量信息列表
	var getVarList;

	var controlList = ["flowchart_start_item",
		"flowchart_tjfz_item",
		"flowchart_tjxh_item",
		"flowchart_yyxh_item",
		"flowchart_jsxh_item",
		"flowchart_yshs_item",
		"flowchart_fzhs_item"
	];
	var controlTypePoint = {
		"flowchart_start_item": {
			"name": "main",
			"head": "TopCenter",
			"body": null,
			"foot": ["BottomCenter"],
			"type": "flow"
		},
		"flowchart_tjfz_item": {
			"name": ["if", "else"],
			"head": "TopCenter",
			"body": null,
			"foot": ["LeftMiddle", "RightMiddle"],
			"type": "flow"
		},
		"flowchart_tjxh_item": {
			"name": "while",
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": ["RightMiddle"],
			"type": "flow"
		},
		"flowchart_yyxh_item": {
			"name": "while(1)",
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": ["RightMiddle"],
			"type": "flow"
		},
		"flowchart_jsxh_item": {
			"name": "for(int ForCount = 0; ForCount < Param; ForCount++)",
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": ["RightMiddle"],
			"type": "flow"
		},
		"flowchart_yshs_item": {
			"name": "delay_ms",
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": ["BottomCenter"],
			"type": "func"
		},
		"flowchart_fzhs_item": {
			"name": "",
			"head": "TopCenter",
			"body": "BottomCenter",
			"foot": ["BottomCenter"],
			"type": "func"
		}
	}

	function getIDByPrefix(prefix, nodes) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].id.indexOf(prefix) != -1) {
				return nodes[i];
			}
		};
		return null;
	}

	function getNodeByID(ID) {
		var nodes = data.nodes
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].id == ID) {
				return nodes[i];
			}
		};
		return null;
	}

	function getProperty(node, isHardware) {
		if (node == null || typeof(node.add_info) == "undefined" || typeof(node.add_info.property) == "undefined" || node.add_info.property == "")
			return "";

		if (!isHardware)
			return "(" + node.add_info.property + ")";
		else
			return node.add_info.property
	}

	function getTargetIDBySourceID(sourceID, links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].source_id == sourceID) {
				return links[i];
			}
		};
		return null;
	}

	function getIDByID(ID) {
		var values = ID.split("_").slice(0, -1);
		return values.join("_");
	}

	function getTypeByID(ID) {
		var type = ID.split("_");
		type = type[0] + "_" + type[1] + "_item";
		return type;
	}

	function getControlTypeInfo(type) {
		var type_info = controlTypePoint[type];
		if (typeof(type_info) == "undefined") {
			return {
				"name": "",
				"body": null,
				"foot": ["BottomCenter"]
			};
		}
		return type_info;
	}

	function getSpace(index) {
		var space = "";
		for (var i = 0; i < index; i++) {
			space += "    ";
		};
		return space;
	}

	function getFuncByType(type) {
		return getNodeInfoByKey(type, "func");
	}

	function getInitFuncByType(type) {
		return getNodeInfoByKey(type, "init_func");
	}

	function createStruct(startID, links, end, index) {
		var str = "";

		var elementType = getTypeByID(startID);
		if (controlList.indexOf(elementType) == -1) {
			//元素不是控制元件
			var flowchartID = getTypeByID(getIDByID(startID));
			var code = getFuncByType(flowchartID);
			var initCode = getInitFuncByType(flowchartID);
			var codeVar = getHardwareInfo(getIDByID(startID));
			var property = getProperty(getNodeByID(getIDByID(startID)), true)

			var initPropertyStr = addPropertyForCode(addVarForCode(initCode, codeVar), property);
			if (initPropertyStr) {
				initStr.push(initPropertyStr);
			}

			if (code) {
				var codePropertyStr = addPropertyForCode(addVarForCode(code, codeVar), property);
				code = codePropertyStr ? codePropertyStr : "";
			} else {
				code = "";
			}
			str += getSpace(index + 1) + code;
			str += "\n";
		}
		var targetInfo = getTargetIDBySourceID(startID, links);
		if (!targetInfo || targetInfo.target_id.indexOf(end) != -1) {
			return str;
		}

		var targetID = targetInfo.target_id;
		var type = getTypeByID(targetID);
		var controlInfo = getControlTypeInfo(type);
		if (controlInfo.body != null) {
			var startID = targetID.replace("TopCenter", controlInfo.body);
			if (controlInfo.type == "flow") {
				str += getSpace(index + 1) + controlInfo.name + getProperty(getNodeByID(getIDByID(targetID)), false) + "{";
				str += "\n";
				str += createStruct(startID, links, targetID.replace("TopCenter", "LeftMiddle"), index + 1);
				str += getSpace(index + 1) + "}";
				str += "\n";
			} else {
				str += getSpace(index + 1) + controlInfo.name + getProperty(getNodeByID(getIDByID(targetID)), false) + ";\n";
			}
		}
		var foot = controlInfo.foot;
		for (var i = 0; i < foot.length; i++) {
			var startID = targetID.replace("TopCenter", foot[i]);
			if (foot.length == 2) {
				var property = "";
				if (i == 0)
					property = getProperty(getNodeByID(getIDByID(targetID)), false);
				str += getSpace(index + 1) + controlInfo.name[i] + property + "{";
				str += "\n";
				str += createStruct(startID, links, end, index + 1);
				str += getSpace(index + 1) + "}";
				str += "\n";
			} else {
				str += createStruct(startID, links, end, index);
			}
		};
		return str;
	}

	function init(containerId, getFlowchart, func, getVar) {
		codeContainerId = containerId;
		getFlowchartElements = getFlowchart;
		getNodeInfoByKey = func;
		getVarList = getVar;
	}

	function generateMain() {
		data = getFlowchartElements();
		var str = "int main(){\n";
		str += generateLocalVar();
		str += getSpace(1) + "Init();\n";
		str += getSpace(1) + "sei();\n";
		var node = getIDByPrefix("flowchart_start", data.nodes);
		if (node != null) {
			var startID = node.id + "_BottomCenter";
			str += createStruct(startID, data.links, "flowchart_end", 0);
		}
		str += getSpace(1) + "return 0;\n";
		str += "}\n";
		return str;
	}

	function generateInit() {
		var str = "void Init(){\n";
		str += getSpace(1) + "initTimer3();\n";
		for (var i = 0; i < initStr.length; i++) {
			if (initStr[i]) {
				str += getSpace(1) + initStr[i] + "\n";
			}
		};
		str += "}\n";
		return str;
	}

	function generateGlobalVar(){
		var str = "";
		var varList = getVarList();
		for(var i = 0; i < varList.length; i++){
			var varInfo = varList[i];
			if(varInfo.scope == "global"){
				str += (varInfo.kind == "auto" ? "" : varInfo.kind + ' ') + varInfo.type + ' ' + varInfo.name + ' = ' + varInfo.initial + ';\n';
			}
		}
		return str;
	}

	function generateLocalVar(){
		var str = "";
		var varList = getVarList();
		for(var i = 0; i < varList.length; i++){
			var varInfo = varList[i];
			if(varInfo.scope == "local"){
				str += getSpace(1) + (varInfo.kind == "auto" ? "" : varInfo.kind + ' ') + varInfo.type + ' ' + varInfo.name + ' = ' + varInfo.initial + ';\n';
			}
		}
		return str;
	}

	var initStr = [];

	function generate() {
		initStr = [];
		var mainStr = generateMain();
		var str = '#define __Motor_USE\n';
		str += '#define __NUM_USE\n';
		str += '#include "Device.h"\n';
		str += '#include <avr/io.h>\n';
		str += '#include <avr/interrupt.h>\n\n';
		str += generateGlobalVar();
		str += '\n';
		str += generateInit();
		str += '\n';
		str += mainStr;
		return str;
	}

	function getHardwareInfo(hardwareID) {
		var hardwareID = getIDByID(hardwareID);
		var content = $("#" + hardwareID + "").parent().html();
		if (!content) {
			return null;
		}
		content = content.split(">");
		content = content[content.length - 1].split("(");
		if (content.length < 2)
			return null;
		content = content[content.length - 1].split(")");
		return {
			port: content[0][0],
			bit: content[0][1]
		};
	}

	function addVarForCode(code, value) {
		if (!code) {
			return null;
		}
		if (value == null) {
			return code;
		} else {
			var portToNum = {
				"A": 0,
				"B": 1,
				"C": 2,
				"D": 3,
				"E": 4,
				"F": 5,
				"G": 6,
			};
			code = code.replace("X", portToNum[value["port"]]);
			code = code.replace(", n", ", " + value["bit"]);
			return code;
		}
	}

	function addPropertyForCode(code, property) {
		if (!code) {
			return null;
		}
		if (!property) {
			return code;
		} else {
			code = code.replace("DigitalValue", property);
			code = code.replace("ToLed(Num)", "ToLed(" + property + ")");
			code = code.replace("read_adc(n)", "read_adc(" + property + ")");
			return code;
		}
	}

	function refresh(){
		var source = generate();
		$('#' + codeContainerId).html(source);
	}

	return {
		init: init,
		refresh: refresh
	}
});