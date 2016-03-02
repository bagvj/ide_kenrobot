define(function() {
	var libraries = [];

	var getNodes;

	var headCodes;
	var varCodes;
	var setupCodes;

	var codeDeclare = "/************************************************************\n *Copyright(C), 2016-2038, KenRobot.com\n *FileName:  //文件名\n *Author:    //作者\n *Version:   //版本\n *Date:      //完成日期\n */\n";
	var autoGenDeclare = "{{indent}}/**********auto generate**********/\n{{code}}{{indent}}/**********block tag: {{tag}}***********/\n";

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

	function gen(oldSource) {
		headCodes = [];
		varCodes = [];
		setupCodes = [];

		visit();

		if(!oldSource) {
			var codeStr = codeDeclare;
			var headStr = genHead();
			if(headStr != "") {
				codeStr += "\n" + headStr + '\n';
			}
			var varStr = genVar();
			if (varStr != "") {
				codeStr += varStr + '\n';
			}
			codeStr += "void setup() {\n";
			var setupStr = genSetup();
			if(setupStr != "") {
				codeStr += setupStr;
			}
			codeStr += '    \n}\n\n';
			codeStr += "void loop() {\n    \n}";

			return codeStr;
		} else {
			oldSource = replaceAuto(oldSource, genHead(), 1);
			oldSource = replaceAuto(oldSource, genVar(), 2);
			oldSource = replaceAuto(oldSource, genSetup(), 3);

			return oldSource;
		}
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

		var str = "";
		var headStr = "";
		for(var i = 0; i < headCodes.length; i++) {
			headStr += headCodes[i] + "\n";
		}
		if(headCodes.length > 0) {
			str += genAuto(headStr, 1);
		}

		return str;
	}

	//生成变量
	function genVar() {
		var str = "";
		var varStr = "";
		for(var i = 0; i < varCodes.length; i++) {
			varStr += varCodes[i];
		}
		if(varCodes.length > 0) {
			str += genAuto(varStr, 2);
		}
		return str;
	}

	//生成初始化函数
	function genSetup() {
		var str = "";
		var setupStr = "";
		for (var i = 0; i < setupCodes.length; i++) {
			setupStr += setupCodes[i];
		};
		if(setupCodes.length > 0) {
			str += genAuto(setupStr, 3, "    ");
		}

		return str;
	}

	//生成缩进
	function genIndent(count) {
		count = count || 1;
		var indent = "";
		for (var i = 0; i < count; i++)
			indent += "    ";
		return indent
	}

	function genAuto(value, tag, indent) {
		indent = indent || "";
		return autoGenDeclare.replace("{{code}}", value).replace("{{tag}}", tag).replace(/\{\{indent\}\}/g, indent);
	}

	function replaceAuto(source, autoCode, tag) {
		var endFlag = "/**********block tag: " + tag + "***********/";
		var endIndex = source.indexOf(endFlag);
		if(endIndex < 0) {
			return source;
		}

		var startFlag = "/**********auto generate**********/";
		var startIndex = source.lastIndexOf(startFlag, endIndex);
		if(startIndex < 0) {
			return source;
		}

		startIndex = source.lastIndexOf("\n", startIndex) + 1;
		endIndex = endIndex + endFlag.length + 1;
		return source.replace(source.substring(startIndex, endIndex), autoCode);
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
		gen: gen,
		addLibrary: addLibrary,
	}
});