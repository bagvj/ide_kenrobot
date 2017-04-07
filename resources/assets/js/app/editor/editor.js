define(['vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/theme-white', 'vendor/ace/theme-arduino', 'vendor/ace/theme-chrome', 'vendor/ace/theme-clouds', 'vendor/ace/theme-eclipse', 'vendor/ace/theme-github', 'vendor/ace/theme-monokai', 'vendor/ace/theme-terminal', 'vendor/ace/theme-textmate', 'vendor/ace/theme-tomorrow', 'vendor/ace/theme-xcode', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools'], function() {
	var editor;
	var js_format_string = Module.cwrap("js_format_string", "string", ["string"]);

	var docCommentTemplate = '/**\n * 日期: {{date}}\n * 作者: {{author}}\n * 描述: \n */\n';
	var initCode = "void setup()\n{\n    \n}\n\nvoid loop()\n{\n    \n}\n";
	var falseValues = ["", false, "0", 0, undefined, null, "false"];

	function init(container, options) {
		editor = ace.edit(container);
		maskHotKey();

		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
		});
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.session.setMode("ace/mode/arduino");

		editor.setTheme("ace/theme/" + (options.theme || "default"));

		var docCommentCode = docCommentTemplate.replace(/\{\{author\}\}/, options.author || "")
			.replace(/\{\{date\}\}/, formatDate(new Date(), "yyyy/MM/dd"));
		// var code = docCommentCode + (isFalse(options.init_code, true) ? "" : "\n" + initCode);
		var code = options.init_code ? docCommentCode + "\n" + init_code : "";

		editor.setValue(code, 1);
	}

	function maskHotKey() {
		editor.commands.addCommands([{
			name: "saveProject",
			bindKey: {
				win: "Ctrl-S",
				mac: "Command-S"
			},
			exec: function() {}
		}, {
			name: "formatCode",
			bindKey: {
				win: "Ctrl-U",
				mac: "Command-U"
			},
			exec: function() {}
		}, {
			name: "movelinesup",
			bindKey: {
				win: "Ctrl-Up",
				mac: "Command-Up"
			},
			exec: function(e) {
				e.moveLinesUp();
			},
			scrollIntoView: "cursor"
		}, {
			name: "movelinesdown",
			bindKey: {
				win: "Ctrl-Down",
				mac: "Command-Down"
			},
			exec: function(e) {
				e.moveLinesDown();
			},
			scrollIntoView: "cursor"
		}, {
			name: "unfind",
			bindKey: {
				win: "Ctrl-F",
				mac: "Command-F"
			},
			exec: function() {},
		}, {
			name: "unreplace",
			bindKey: {
				win: "Ctrl-H",
				mac: "Command-Option-F"
			},
			exec: function() {},
		}, {
			name: "showSettingsMenu",
			bindKey: {
				win: "Ctrl-,",
				mac: "Command-,"
			},
			exec: function() {},
		}, {
			name: "centerselection",
			bindKey: {
				win: "Ctrl-L",
				mac: "Command-L",
			},
			exec: function() {},
		}]);
	}

	function formatDate(date, format) {
		if (typeof date == "number") {
			date = new Date(date);
		}
		var o = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate(),
			"h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
			"H+": date.getHours(),
			"m+": date.getMinutes(),
			"s+": date.getSeconds(),
			"q+": Math.floor((date.getMonth() + 3) / 3),
			"S": date.getMilliseconds()
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(format)) {
			var week = ["日", "一", "二", "三", "四", "五", "六"];
			format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay()]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	}

	function isFalse(value, defaultValue) {
		return value === undefined ? !defaultValue : falseValues.indexOf(value) >= 0;
	}

	function getCode() {
		return editor.getValue();
	}

	function setCode(code) {
		editor.setValue(code || "", -1);
	}

	function format() {
		var placeholder = "kenrobot_reformat_cursor";
		var old_position = editor.getCursorPosition();
		var old_code_lines = editor.getSession().getValue().split("\n");
		old_code_lines[old_position.row] = old_code_lines[old_position.row].slice(0, old_position.column) + placeholder + old_code_lines[old_position.row].slice(old_position.column);
		var formatted_lines = js_format_string(old_code_lines.join("\n")).split("\n");
		for (var i = 0; i < formatted_lines.length; i++) {
			var index = formatted_lines[i].indexOf(placeholder);
			if (index !== -1) {
				formatted_lines[i] = formatted_lines[i].substring(0, index) + formatted_lines[i].substring(index + placeholder.length, formatted_lines[i].length);
				editor.getSession().setValue(formatted_lines.join("\n"));
				editor.getSession().getSelection().selectionLead.setPosition(i, index);
				editor.focus();
				break
			}
		}
	}

	function redo() {
		editor.redo();
	}

	function undo() {
		editor.undo();
	}

	function setTheme(theme) {
		editor.setTheme("ace/theme/" + theme);
	}

	return {
		init: init,

		getCode: getCode,
		setCode: setCode,
		format: format,
		redo: redo,
		undo: undo,
		setTheme: setTheme,
	}
});