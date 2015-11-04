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
		if(varStr != ""){
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
		var defaultInitCode = "initTimer3();"
		initCodes.splice(0, 0, defaultInitCode);

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
		var startNodePrefix = "flowchart_start";
		var startNode = findStartNode(startNodePrefix);
		if (startNode == null) {
			return;
		}

		var endNodePrefix = "flowchart_end";
		var nodeId = startNode.id + "_BottomCenter";
		bodyCode = visitNode(nodeId, endNodePrefix, 1);
	}

	//寻找开始结点
	function findStartNode(startNodePrefix) {
		var nodes = flowchart.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.id.indexOf(startNodePrefix) != -1) {
				return node;
			}
		}
		return null;
	}

	function visitNode(nodeId, endNodePrefix, index) {
		var str = "";
		var ids = nodeId.split("_");
		var nodeName = ids[1];
		var nodeConfig = configs[nodeName];
		if (nodeConfig === undefined) {
			//找不到结点配置
			console.log("unknow node: " + nodeName);
			return str;
		}

		var nodeInfo = getNodeInfo(nodeId);
		if (nodeInfo == null) {
			//找不到结点信息
			console.log("can not find node info: " + nodeName);
			return str;
		}

		var nodeType = nodeConfig.type;
		if (nodeType > 3) {
			if (nodeType == 4 || nodeType == 5) {
				//硬件结点或者函数结点
				var initCode = getFormatExp(nodeConfig, nodeInfo, true);
				if (initCode && initCode != "") {
					initCodes.push(initCode);
				}
				str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "\n";
			}
		}
		var targetId = getTargetId(nodeId);
		if (!targetId || targetId.indexOf(endNodePrefix) != -1) {
			return str;
		}

		ids = targetId.split("_");
		nodeName = ids[1];
		nodeConfig = configs[nodeName];
		if (nodeConfig === undefined) {
			//找不到结点配置
			console.log("unknow node: " + nodeName);
			return str;
		}

		nodeInfo = getNodeInfo(targetId);
		if (nodeInfo == null) {
			//找不到结点信息
			console.log("can not find node info: " + nodeName);
			return str;
		}
		if (nodeConfig.body) {
			var subNodeId = targetId.replace("TopCenter", nodeConfig.body);
			str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "{\n";
			var subCode = visitNode(subNodeId, targetId.replace("TopCenter", "LeftMiddle"), index + 1);
			str += subCode == "" ? "\n" : subCode;
			str += genIndent(index) + "}\n";
		}

		var foot = nodeConfig.foot;
		foot = (foot instanceof Array) ? foot : [foot];
		for (var i = 0; i < foot.length; i++) {
			var subNodeId = targetId.replace("TopCenter", foot[i]);
			if (foot.length == 2) {
				if (i == 0) {
					str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "{\n";
					var subCode = visitNode(subNodeId, endNodePrefix, index + 1);
					str += subCode == "" ? "\n" : subCode;
				} else {
					str += genIndent(index) + "} else {\n";
					var subCode = visitNode(subNodeId, endNodePrefix, index + 1);
					str += subCode == "" ? "\n" : subCode;
					str += genIndent(index) + "}\n";
				}
			} else {
				str += visitNode(subNodeId, endNodePrefix, index);
			}
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

	function getTargetId(sourceId) {
		var links = flowchart.links;
		for (var i = 0; i < links.length; i++) {
			var linkInfo = links[i];
			if (linkInfo.source_id == sourceId) {
				return linkInfo.target_id;
			}
		};
		return null;
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
					value = port || value;
				} else if (param.name == "bit") {
					value = bit || value;
				} else {
					var infoName = isInit ? "init_" + param.name : param.name;
					if (infoParams && infoParams[infoName]) {
						value = infoParams[infoName];
					}
				}
				format = format.replace(param.name, value);
			}
		}

		return format === undefined ? "" : format;
	}

	return {
		init: init,
		refresh: refresh
	};
});