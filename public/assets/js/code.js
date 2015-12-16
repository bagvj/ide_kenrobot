define(["jquery", "hljs", "EventManager"], function($, hljs, EventManager) {
	var container;

	var configs;

	var findSpecNode;
	var findTargetNode;
	var findIfMergeNode;
	var getVars;

	var vars;
	var setupInitCodes;
	var loopInitCodes;
	var setupCode;
	var loopCode;

	function init(containerId, _configs, funcs) {
		container = $("#" + containerId);
		configs = _configs;
		findSpecNode = funcs.findSpecNode;
		findTargetNode = funcs.findTargetNode;
		findIfMergeNode = funcs.findIfMergeNode;
		getVars = funcs.getVars;

		EventManager.bind("code", "refresh", onRefresh)
	}

	function gen() {
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

	function onRefresh() {
		var source = gen();
		container.html(source);
		$('pre code').each(function(i, block) {
			hljs.highlightBlock(block);
		});
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
		initCodes = initCodes.concat(setupInitCodes)
		initCodes = initCodes.concat(loopInitCodes);

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
		var startNode = findSpecNode("start");
		var loopStartNode = findSpecNode("loopStart");
		var endNode = findSpecNode("end");

		setupCode = visitNode(startNode, loopStartNode, 1, setupInitCodes);
		loopCode = visitNode(loopStartNode, endNode, 1, loopInitCodes);
	}

	function visitNode(node, endNode, index, initCodes) {
		var str = "";
		while(node != endNode) {
			var nodeData = node.data;
			var nodeName = nodeData.name;
			var nodeTag = nodeData.tag;
			if(nodeTag == 1) {
				node = findTargetNode(node, "B");
			} else if(nodeTag == 2) {
				var subTag = nodeData.subTag;
				if(subTag == 1) {
					var mergeNode = findIfMergeNode(node);
					var yesNode = findTargetNode(node, "L");
					var noNode = findTargetNode(node, "R");
					var yesCode = visitNode(yesNode, mergeNode, index + 1, initCodes);
					var noCode = visitNode(noNode, mergeNode, index + 1, initCodes);
					
					str += genIndent(index) + getFormatExp(nodeData, false) + "{\n";
					str += yesCode == "" ? "\n" : yesCode;
					str += genIndent(index) + "} else {\n";
					str += noCode == "" ? "\n" : noCode;
					str += genIndent(index) + "}\n";

					node = mergeNode;
				} else if(subTag == 2) {
					str += genIndent(index) + getFormatExp(nodeData, false) + "{\n";
					var bodyNode = findTargetNode(node, "B");
					var innerCode = visitNode(bodyNode, node, index + 1, initCodes);
					str += innerCode == "" ? "\n" : innerCode;
					str += genIndent(index) + "}\n";
					node = findTargetNode(node, "R");
				} else {
					console.log("unknow node subTag: " + subTag);
					break;
				}
			} else if (nodeTag == 3 || nodeTag == 4) {
				//硬件节点或者函数节点
				var initCode = getFormatExp(nodeData, true);
				if (initCode && initCode != "") {
					initCodes.push(initCode);
				}
				str += genIndent(index) + getFormatExp(nodeData, false) + "\n";
				node = findTargetNode(node, "B");
			} else {
				console.log("unknow node type: " + nodeTag);
				break;
			}
		}
		return str;
	}

	function getFormatExp(nodeData, isInit) {
		var format = "";
		var params;

		if (isInit) {
			format = nodeData.initFormat;
			params = nodeData.initParams;
		} else {
			format = nodeData.format;
			params = nodeData.params;
		}

		if (params) {
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				var value = param.defaultValue;
				if(param.name == "port") {
					if(nodeData.portIndex != undefined){
						value = nodeData.portIndex;
					}
				} else if(param.name == "bit") {
					if(nodeData.bitIndex != undefined){
						value = nodeData.bitIndex;
					}
				}
				var regExp = new RegExp(param.name, "g");
				format = format.replace(regExp, value);
			}
		}

		return format === undefined ? "" : format;
	}

	function getConfig(name) {
		return configs[name];
	}

	return {
		init: init,
		gen: gen,
	}
});