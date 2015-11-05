define(["jquery"], function($) {
	var containerId;
	var configs;
	var getFlowchart;
	var getVars;

	var flowchart;
	var vars;
	var initCodes;
	var bodyCode;

	function init(codeContainerId, flowchartConfigs, getFlowchartElements, getVarList) {
		containerId = codeContainerId;
		configs = flowchartConfigs;
		getFlowchart = getFlowchartElements;
		getVars = getVarList;
	}

	function refresh() {
		var source = gen();
		$('#' + containerId).html(source);
	}

	//生成代码
	function gen() {
		flowchart = getFlowchart();
		vars = getVars();

		initCodes = [];
		bodyCode = "";
		visit();

		var str = genHead();
		str += '\n';
		var varStr = genVar();
		if (varStr != "") {
			str += varStr + '\n';
		}
		str += genSetup();
		str += '\n';
		str += genLoop();

		return str;
	}

	//生成头部
	function genHead() {
		var str = '#include "Rosys.h"\n';
		return str;
	}

	//生成变量
	function genVar() {
		var str = "";
		for (var i = 0; i < vars.length; i++) {
			var varInfo = vars[i];
			str += (varInfo.kind == "auto" ? "" : varInfo.kind + ' ') + varInfo.type + ' ' + varInfo.name + ' = ' + varInfo.initial + ';\n';
		}
		return str;
	}

	//生成初始化函数
	function genSetup() {
		var defaultInitCode1 = "initTimer3();";
		var defaultInitCode2 = "sei();";
		initCodes.splice(0, 0, defaultInitCode1, defaultInitCode2);

		var str = "void setup(){\n";
		for (var i = 0; i < initCodes.length; i++) {
			str += genIndent(1) + initCodes[i] + "\n";
		};
		str += "}\n";

		return str;
	}

	//生成Main函数
	function genLoop() {
		var str = "void loop(){\n";
		str += bodyCode == "" ? '\n' : bodyCode;
		str += "}\n";

		return str;
	}

	//生成缩进
	function genIndent(count) {
		var indent = "";
		for (var i = 0; i < count; i++)
			indent += "    ";
		return indent
	}

	function visit() {
		var startPrefix = "flowchart_start";
		var startNode = findNode(startPrefix);
		var endPrefix = "flowchart_end";
		var endNode = findNode(endPrefix);
		if (startNode == null || endNode == null) {
			return;
		}

		var startNodeId = startNode.id + "_BottomCenter";
		var endNodeId = endNode.id + "_TopCenter";
		bodyCode = visitNode(startNodeId, endNodeId, 1);
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

	function visitNode(nodeId, endNodeId, index) {
		var str = "";
		console.log("nodeId " + nodeId);
		var linkInfo = getLinkInfo(nodeId);
		if(!linkInfo){
			return str;
		}

		var targetId = linkInfo.targetId;
		if(targetId == endNodeId) {
			return str;
		}

		var nodeName = targetId.split("_")[1];
		var nodeConfig = configs[nodeName];
		var nodeType = nodeConfig.type;
		var subType = nodeConfig.subType;

		if (nodeConfig === undefined) {
			//找不到节点配置
			console.log("unknow node: " + nodeName);
			return str;
		}

		var nodeInfo = getNodeInfo(targetId);
		if (nodeInfo == null) {
			//找不到节点信息
			console.log("can not find node info: " + nodeName);
			return str;
		}

		if (nodeType == 1) {
			str += visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, index);
		} else if (nodeType == 2) {

		} else if (nodeType == 3) {
			if (subType == 1) {
				//循环
				str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "{\n";
				var innerCode = visitNode(targetId.replace("TopCenter", "BottomCenter"), targetId.replace("TopCenter", "LeftMiddle"), index + 1);
				str += innerCode == "" ? "\n" : innerCode;
				str += genIndent(index) + "}\n";
				str += visitNode(targetId.replace("TopCenter", "RightMiddle"), endNodeId, index);
			} else if (subType == 2) {
				//条件分支
				var mergeId = targetId.substring(0, targetId.lastIndexOf("_")).replace("tjfz", "tjfzMerge");
				str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "{\n";
				var yesCode = visitNode(targetId.replace("TopCenter", "BottomCenter"), mergeId + "_TopCenter", index + 1);
				str += yesCode == "" ? "\n" : yesCode;
				str += genIndent(index) + "} else {\n";
				var noCode = visitNode(targetId.replace("TopCenter", "RightMiddle"), mergeId + "_RightMiddle", index + 1);
				str += noCode == "" ? "\n" : noCode;
				str += genIndent(index) + "}\n";
				str += visitNode(mergeId + "_BottomCenter", endNodeId, index);
			} else if (subType == 3) {
				//分支合并
			} else {
				console.log("unknow node sub type: " + subType);
			}
		} else if (nodeType == 4 || nodeType == 5) {
			//硬件节点或者函数节点
			var initCode = getFormatExp(nodeConfig, nodeInfo, true);
			if (initCode && initCode != "") {
				initCodes.push(initCode);
			}
			str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "\n";
			str += visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, index);
		} else {
			console.log("unknow node type: " + nodeType);
		}

		return str;
	}

	function getNodeInfo(nodeId) {
		nodeId = nodeId.substring(0, nodeId.lastIndexOf("_"));

		var nodes = flowchart.nodes
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

	function isEndNode(sourceId, targetId) {
		if(sourceId == targetId){
			return true;
		}

		var links = flowchart.links;
		for (var i = 0; i < links.length; i++) {
			var linkInfo = links[i];
			if (linkInfo.sourceId == targetId) {
				return true;
			}
		};
		return false;
	}

	function getFormatExp(nodeConfig, nodeInfo, isInit) {
		var format = "";
		var params;

		var infoParams = nodeInfo.add_info;
		if (isInit) {
			format = nodeConfig.initFormat;
			params = nodeConfig.initParams;
		} else {
			format = nodeConfig.format;
			params = nodeConfig.params;
		}

		if (params) {
			var text = nodeInfo.text;
			text = text.substring(text.indexOf("(") + 1, text.indexOf(")"));
			var port;
			var bit;
			if (text.length >= 2) {
				port = text.charCodeAt(0) - 'A'.charCodeAt(0);
				if (text.length == 2) {
					bit = text[1];
				}
			}

			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				var value = param.defaultValue;
				if (param.name == "port") {
					if (port !== undefined) {
						value = port;
					}
				} else if (param.name == "bit") {
					if (bit !== undefined) {
						value = bit;
					}
				} else {
					var infoName = isInit ? "init_" + param.name : param.name;
					if (infoParams && infoParams[infoName]) {
						value = infoParams[infoName];
					}
				}
				var regExp = new RegExp(param.name, "g");
				format = format.replace(regExp, value);
			}
		}

		return format === undefined ? "" : format;
	}

	return {
		init: init,
		refresh: refresh
	};
});