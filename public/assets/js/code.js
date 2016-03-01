define(function() {
	var libraries = [];

	var getNodes;

	var headCodes;
	var varCodes;
	var setupCodes;

	function init(_getNodes) {
		getNodes = _getNodes;
	}

	function addLibrary(library) {
		var codes = library.split("\n");
		for(var i = 0; i < codes.length; i++) {
			var line = codes[i];
			if(line != "" && libraries.indexOf(line) < 0) {
				libraries.push(line);
			}
		}
	}

	function reset() {
		headCodes = [];
		varCodes = [];
		setupCodes = [];
		libraries = [];
	}

	function gen() {
		headCodes = [];
		varCodes = [];
		setupCodes = [];

		visit();

		var codeStr = "";
		var headStr = genHead();
		if(headStr != "") {
			codeStr += headStr + '\n';
		}
		var varStr = genVar();
		if (varStr != "") {
			codeStr += varStr + '\n';
		}
		codeStr += genSetup();
		codeStr += '\n';
		codeStr += genLoop();

		return codeStr;
	}

	//生成头部
	function genHead() {
		for(var i = 0; i < libraries.length; i++) {
			var line = libraries[i];
			if(line != "" && headCodes.indexOf(line) < 0) {
				headCodes.push(line);
			}
		}

		headCodes = headCodes.sort(function(a, b) {
			return a.localeCompare(b);
		});
		var str = "/************************************************************\n *Copyright(C), 2016-2038, KenRobot.com\n *FileName:  //文件名\n *Author:    //作者\n *Version:   //版本\n *Date:      //完成日期\n */\n";
		for(var i = 0; i < headCodes.length; i++) {
			str += headCodes[i] + "\n";
		}
		return str;
	}

	//生成变量
	function genVar() {
		var str = "";
		for(var i = 0; i < varCodes.length; i++) {
			str += varCodes[i];
		}
		return str;
	}

	//生成初始化函数
	function genSetup() {
		var str = "void setup() {\n";
		var setupStr = "";
		for (var i = 0; i < setupCodes.length; i++) {
			setupStr += setupCodes[i];
		};
		str += setupStr == "" ? "    \n" : setupStr;
		str += "}\n";

		return str;
	}

	//生成Main函数
	function genLoop() {
		var str = "void loop() {\n    \n";
		str += "}";

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
		var nodes = getNodes();
		for(var i = 0; i < nodes.length; i++) {
			var nodeData = nodes[i];

			if(nodeData.headCode != "") {
				var codes = nodeData.headCode.split('\n');
				for(var j = 0; j < codes.length; j++) {
					var line = codes[j];
					if(line != "" && headCodes.indexOf(line) < 0) {
						headCodes.push(line);
					}
				}
			}

			var ports = nodeData.ports;
			var port;

			var varCode = nodeData.varCode;
			if(varCode != "") {
				varCode = varCode.replace(/\$NAME/g, nodeData.varName);
				for(var j = 0; j < ports.length; j++) {
					port = ports[j];
					varCode = varCode.replace("$" + port.source, port.target);
				}
				varCodes.push(varCode);
			}
			
			var setupCode = nodeData.setupCode;
			if(setupCode != "") {
				setupCode = setupCode.replace(/\$NAME/g, nodeData.varName);
				for(var j = 0; j < ports.length; j++) {
					port = ports[j];
					setupCode = setupCode.replace("$" + port.source, port.target);
				}
				setupCode = setupCode.replace(/([^\n]*\n)/g , "    $1");
				setupCodes.push(setupCode);
			}
		}
	}

	return {
		init: init,
		addLibrary: addLibrary,
		gen: gen,
		reset: reset,
	}
});