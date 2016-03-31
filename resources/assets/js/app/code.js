define(function() {
	var libraries = [];

	var getNodes;
	var getFileName;
	var getAuthor;

	var headCodes;
	var varCodes;
	var setupCodes;

	var codeDeclare = "/************************************************************\n * Copyright(C), 2016-2038, KenRobot.com\n * FileName: {{filename}}\n * Author: {{author}}\n * Date: {{date}}\n */\n";
	var autoGenDeclare = "{{indent}}//auto generate\n{{indent}}//warning: please don't modify\n{{code}}{{indent}}//end auto generate. block tag: {{tag}}\n";

	function init(api) {
		getNodes = api.getNodes;
		getFileName = api.getFileName;
		getAuthor = api.getAuthor;
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
			var codeStr = genDeclare();
			var headStr = genHead();
			if(headStr != "") {
				codeStr += "\n" + headStr;
			}
			var varStr = genVar();
			if (varStr != "") {
				codeStr += "\n" + varStr + '\n';
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
			oldSource = replaceAuto(oldSource, genDeclare(), "declare");
			oldSource = replaceAuto(oldSource, genHead(), "head");
			oldSource = replaceAuto(oldSource, genVar(), "variable");
			oldSource = replaceAuto(oldSource, genSetup(), "setup");

			return oldSource;
		}
	}

	function getCodeInfo() {
		var now = new Date();
		var filename = getFileName() + ".ino";
		var author = getAuthor();
		if(author == "") {
			author = "啃萝卜";
		}
		var date = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();

		return {
			filename: filename,
			author: author,
			date: date,
		};
	}

	function genDeclare() {
		var codeInfo = getCodeInfo();
		return codeDeclare.replace("{{filename}}", codeInfo.filename).replace("{{author}}", codeInfo.author).replace("{{date}}", codeInfo.date);
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
		str += genAuto(headStr, "head");

		return str;
	}

	//生成变量
	function genVar() {
		var str = "";
		var varStr = "";
		for(var i = 0; i < varCodes.length; i++) {
			varStr += varCodes[i];
		}
		str += genAuto(varStr, "variable");

		return str;
	}

	//生成初始化函数
	function genSetup() {
		var str = "";
		var setupStr = "";
		for (var i = 0; i < setupCodes.length; i++) {
			setupStr += setupCodes[i];
		};
		str += genAuto(setupStr, "setup", "    ");

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
		if(tag == "declare") {
			var flag = "Copyright(C)";
			var index = source.indexOf(flag);
			if(index < 0) {
				return source;
			}

			var startFlag = "/**********";
			var startIndex = source.lastIndexOf(startFlag, index);
			if(startIndex < 0) {
				return source;
			}

			var endFlag = " */\n";
			var endIndex = source.indexOf(endFlag, index);
			if(endIndex < 0) {
				return source;
			}

			endIndex = endIndex + endFlag.length;
			return source.replace(source.substring(startIndex, endIndex), autoCode);
		} else {
			var endFlag = "//end auto generate. block tag: " + tag;
			var endIndex = source.indexOf(endFlag);
			if(endIndex < 0) {
				return source;
			}

			var startFlag = "//auto generate";
			var startIndex = source.lastIndexOf(startFlag, endIndex);
			if(startIndex < 0) {
				return source;
			}

			startIndex = source.lastIndexOf("\n", startIndex) + 1;
			endIndex = endIndex + endFlag.length + 1;
			return source.replace(source.substring(startIndex, endIndex), autoCode);
		}
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