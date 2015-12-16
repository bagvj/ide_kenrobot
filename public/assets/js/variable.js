define(["jquery", "kenrobotDialog", "EventManager"], function($, kenrobotDialog, EventManager) {
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
		varInfo.kind = varInfo.kind || "auto";
		varInfo.initial = varInfo.initial || "";
		varInfo.initial = varInfo.initial == "" ? (varInfo.type == "bool" ? "false" : (varInfo.type == "unsigned char" ? "''" : "0")) : varInfo.initial;
		
		vars.push({
			name: varInfo.name,
			type: varInfo.type,
			kind: varInfo.kind,
			initial: varInfo.initial
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
		info.kind = varInfo.kind || "auto";
		info.initial = varInfo.initial || "";
		info.initial = info.initial == "" ? (info.type == "bool" ? "false" : (info.type == "unsigned char" ? "''" : "0")) : info.initial;
		
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
		return "<td>" + varInfo.name + "</td><td>" + varInfo.type + "</td><td>" + varInfo.kind + "</td><td>" + varInfo.initial + "</td><td></td>"
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