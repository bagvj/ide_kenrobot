define(["jquery", "util", "hardware", "software", "EventManager"], function($, util, hardware, software, EventManager) {
	//C++关键字
	var keywords = [
		"asm", "do", "if", "return", "typedef", "auto", "double",
		"inline", "short", "typeid", "bool", "dynamic_cast", "int",
		"signed", "typename", "break", "else", "long", "sizeof", "union",
		"case", "enum", "mutable", "static", "unsigned", "catch", "explicit",
		"namespace", "static_cast", "using", "char", "export",
		"new", "struct", "virtual", "class", "extern", "operator",
		"switch", "void", "const", "false", "private", "template",
		"volatile", "const_cast", "float", "protected", "this",
		"wchar_t", "continue", "for", "public", "throw", "while",
		"default", "friend", "register", "true", "delete", "goto",
		"reinterpret_cast", "try", "_Bool", "_Complex", "_Imaginary",
	];

	//合法的变量名正则表达式
	var nameRegex = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

	var container;
	var vars;

	function init(containerId) {
		container = $("#" + containerId);
		vars = [];

		EventManager.bind("hardware", "addNode", onHardwareAddNode);
		EventManager.bind("hardware", "deleteNode", onHardwareDeleteNode);
	}

	function getVars() {
		return vars;
	}

	function getVar(index) {
		return vars[index];
	}

	function addVar(varInfo) {
		var checkInfo = checkVar(varInfo.name);
		if(!checkInfo.result) {
			alert(checkInfo.message);
			return false;
		}

		varInfo.type = varInfo.type || "int";
		varInfo.storage_type = varInfo.storage_type || "auto";
		varInfo.default_value = varInfo.default_value || "";
		varInfo.default_value = varInfo.default_value == "" ? (varInfo.type == "bool" ? "false" : (varInfo.type == "unsigned char" ? "''" : "0")) : varInfo.default_value;
		
		vars.push({
			name: varInfo.name,
			type: varInfo.type,
			storage_type: varInfo.storage_type,
			default_value: varInfo.default_value,
			hardware_key: varInfo.hardware_key,
		});

		$("tbody tr.active", container).removeClass("active");
		$('<tr>').addClass("active").html(getFormatTR(varInfo)).appendTo($("tbody", container)).click(function() {
			$("tbody tr.active", container).removeClass("active");
			$(this).addClass("active");
		});

		EventManager.trigger("code", "refresh");
	}

	function saveVar(varInfo, index) {
		var checkInfo = checkVar(varInfo.name, index);
		if(!checkInfo.result) {
			alert(checkInfo.message);
			return false;
		}

		var info = vars[index];
		info.name = varInfo.name;
		info.type = varInfo.type || "int";
		info.storage_type = varInfo.storage_type || "auto";
		info.default_value = varInfo.default_value || "";
		info.default_value = info.default_value == "" ? (info.type == "bool" ? "false" : (info.type == "unsigned char" ? "''" : "0")) : info.default_value;
		
		$("tbody tr.active", container).removeClass("active");
		$('tbody tr:eq(' + index + ')', container).addClass("active").html(getFormatTR(info));

		EventManager.trigger("code", "refresh");
	}

	function deleteVar() {
		var curRow = $("tbody tr.active", container);
		if(curRow.length == 0) {
			return;
		}

		var index = curRow.index();
		vars.splice(index, 1);
		curRow.remove();

		EventManager.trigger("code", "refresh");
	}

	function checkVar(name, index) {
		if(name == "") {
			return {
				message: "变量名不能为空",
				result: false
			};
		}

		if(keywords.indexOf(name) >= 0) {
			return {
				message: "变量名不能是关键字",
				result: false
			};
		}

		if(!nameRegex.test(name)) {
			return {
				message: "变量名只能由字母、数字或下划线组成，且不能以数字开头",
				result: false
			};
		}

		index = index || -1;
		for(var i = 0; i < vars.length; i++) {
			var varInfo = vars[i];
			if(i != index && varInfo.name == name) {
				return {
					message: "变量名重复",
					result: false
				};
			}
		}

		return {
			result: true
		};
	}

	function getFormatTR(varInfo) {
		return "<td>" + varInfo.name + "</td><td>" + varInfo.type + "</td><td>" + varInfo.storage_type + "</td><td>" + varInfo.default_value + "</td><td></td>"
	}

	function onHardwareAddNode(args) {
		var key = args.key;
		var nodeData = hardware.getNodeData(key);
		if(!nodeData){
			return;
		}

		var name = nodeData.name;
		var nodeConfig = software.getConfig(name);
		if(!nodeConfig) {
			return;
		}

		var toAddVars = [];
		var params = nodeConfig.init_params;
		for(var i = 0; i < params.length; i++) {
			var param = params[i];
			if(!param.auto_set && param.is_input) {
				toAddVars.push({
					storage_type: param.storage_type,
					type: param.type,
					name: param.default_value,
					hardware_key: key,
				});
			}
		}

		params = nodeConfig.params;
		for(var i = 0; i < params.length; i++) {
			var param = params[i];
			if(!param.auto_set && param.is_input) {
				toAddVars.push({
					storage_type: param.storage_type,
					type: param.type,
					name: param.default_value,
					hardware_key: key,
				});
			}
		}

		for(var i = 0; i < toAddVars.length; i++) {
			var varInfo = toAddVars[i];
			var name = varInfo.name;
			var valid = checkVar(name);
			var index = 0;
			while(!valid.result) {
				index = index + 1;
				name = varInfo.name + index;
				valid = checkVar(name);
			}
			varInfo.name = name;
			addVar(varInfo);
		}
	}

	function onHardwareDeleteNode(args) {
		var key = args.key;
		var index = -1;
		for(var i = 0; i < vars.length; i++) {
			var varInfo = vars[i];
			if(varInfo.hardware_key == key) {
				index = i;
				break;
			}
		}
		if(index >= 0) {
			vars.splice(index, 1);
			$("tbody tr:eq(" + index + ")", container).remove();
			EventManager.trigger("code", "refresh");
		}
	}

	return {
		init: init,
		getVars: getVars,
		getVar: getVar,
		addVar: addVar,
		saveVar: saveVar,
		deleteVar: deleteVar,
		checkVar: checkVar,
	}
});