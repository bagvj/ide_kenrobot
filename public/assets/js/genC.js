define(["jquery",'hljs'], function($,hljs) {
	var containerId;
	var configs;
	var getFlowchart;
	var getVars;

	var flowchart;
	var vars;
	var setupInitCodes;
	var loopInitCodes;
	var setupCode;
	var loopCode;

	function init(codeContainerId, flowchartConfigs, getFlowchartElements, getVarList) {
		containerId = codeContainerId;
		configs = flowchartConfigs;
		getFlowchart = getFlowchartElements;
		getVars = getVarList;
	}

	function refresh() {
		var source = gen();
		$('#' + containerId).html(source);
		$('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
                
        });

	}

	//生成代码
	function gen() {
		flowchart = getFlowchart();
		vars = getVars();

		setupInitCodes = [];
		loopInitCodes = [];
		setupCode = "";
		loopCode = "";

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
		var initCodes = ["initTimer3();", "sei();"];
		initCodes.concat(setupInitCodes).concat(loopInitCodes);

		var str = "void setup(){\n";
		for (var i = 0; i < initCodes.length; i++) {
			str += genIndent(1) + initCodes[i] + "\n";
		};
		str += setupCode;
		str += "}\n";

		return str;
	}

	//生成Main函数
	function genLoop() {
		var str = "void loop(){\n";
		str += loopCode == "" ? '\n' : loopCode;
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
		var startNode = findNode("flowchart_start");
		var loopStartNode = findNode("flowchart_loopStart");
		var endNode = findNode("flowchart_end");

		if (startNode == null || loopStartNode == null || endNode == null) {
			return;
		}

		setupCode = visitNode(startNode.id + "_BottomCenter", loopStartNode.id + "_TopCenter", 1, setupInitCodes);
		loopCode = visitNode(loopStartNode.id + "_BottomCenter", endNode.id + "_TopCenter", 1, loopInitCodes);
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

	function visitNode(nodeId, endNodeId, index, initCodes) {
		var str = "";
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
		var nodeTag = nodeConfig.tag;
		var subTag = nodeConfig.subTag;

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

		if (nodeTag == 1) {
			str += visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, index);
		} else if (nodeTag == 2) {
			if (subTag == 1) {
				//循环
				str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "{\n";
				var innerCode = visitNode(targetId.replace("TopCenter", "BottomCenter"), targetId.replace("TopCenter", "LeftMiddle"), index + 1);
				str += innerCode == "" ? "\n" : innerCode;
				str += genIndent(index) + "}\n";
				str += visitNode(targetId.replace("TopCenter", "RightMiddle"), endNodeId, index);
			} else if (subTag == 2) {
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
			} else if(subTag == 3) {
				//do nothing
			} else {
				console.log("unknow node sub type: " + subTag);
			}
		} else if (nodeTag == 3 || nodeTag == 4) {
			//硬件节点或者函数节点
			var initCode = getFormatExp(nodeConfig, nodeInfo, true);
			if (initCode && initCode != "") {
				initCodes.push(initCode);
			}
			str += genIndent(index) + getFormatExp(nodeConfig, nodeInfo, false) + "\n";
			str += visitNode(targetId.replace("TopCenter", "BottomCenter"), endNodeId, index);
		} else {
			console.log("unknow node type: " + nodeTag);
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