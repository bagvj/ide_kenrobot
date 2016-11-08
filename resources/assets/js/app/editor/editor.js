define(['vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools'], function() {
	var editor;
	var js_format_string = Module.cwrap("js_format_string", "string", ["string"]);

	function init(container) {
		editor = ace.edit(container);
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
		});
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/default");
		editor.session.setMode("ace/mode/arduino");

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

	return {
		init: init,

		getCode: getCode,
		setCode: setCode,
		format: format,
	}
});