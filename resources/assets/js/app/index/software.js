define(['vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/theme-white', 'vendor/ace/theme-chrome', 'vendor/ace/theme-clouds', 'vendor/ace/theme-eclipse', 'vendor/ace/theme-github', 'vendor/ace/theme-monokai', 'vendor/ace/theme-terminal', 'vendor/ace/theme-textmate', 'vendor/ace/theme-tomorrow', 'vendor/ace/theme-xcode', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', 'vendor/ace/ext-code_blast', 'vendor/jquery', './EventManager', './library', './code'], function(_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, EventManager, library, code) {
	var editor;
	var js_format_string = Module.cwrap("js_format_string", "string", ["string"]);
	var configs;

	function init(api) {
		editor = ace.edit($(".software .editor")[0]);
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			// blastCode: true,
		});
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/default");
		editor.session.setMode("ace/mode/arduino");
		editor.on('change', onEditorChange);

		editor.commands.addCommands([{
			name: "saveProject",
			bindKey: {
				win: "Ctrl-S",
				mac: "Command-S"
			},
			exec: function() {
				EventManager.trigger('project', 'save');
			}
		}, {
			name: "buildProject",
			bindKey: {
				win: "Ctrl-B",
				mac: "Command-B"
			},
			exec: function() {
				EventManager.trigger('project', 'build');
			}
		}, {
			name: "formatCode",
			bindKey: {
				win: "Ctrl-U",
				mac: "Command-U"
			},
			exec: function() {
				format();
			}
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
		
		code.init(api);
		EventManager.bind("bottomContainer", "resize", onResize);
		EventManager.bind("rightBar", "resize", onResize);
		EventManager.bind("setting", "change", onSettingChange);
		EventManager.bind("library", "change", onLibraryChange);
		EventManager.bind("software", "format", format);
	}

	function load(_configs) {
		configs = _configs;
	}

	function setData(data) {
		data = data || {};
		var libraries = data.libraries || [];
		library.setData(libraries);

		var source = data.source || code.gen();
		editor.setValue(maskCode(source), 1);
	}

	function getData() {
		return {
			libraries: library.getData(),
			source: maskCode(editor.getValue(), true),
		};
	}

	function gen() {
		editor.setValue(maskCode(code.gen(editor.getValue())), 1);
	}

	function maskCode(source, tag) {
		if(tag) {
			return source.replace(/<KenrobotSoftwareSerial\.h>/g, "<bqSoftwareSerial.h>")
						 .replace(/kenSoftwareSerial/g, "bqSoftwareSerial");
		} else {
			return source.replace(/<bqSoftwareSerial\.h>/g, "<KenrobotSoftwareSerial.h>")
						 .replace(/bqSoftwareSerial/g, "kenSoftwareSerial");
		}
	}

	function format() {
		// var source = js_beautify(editor.getValue());
		// editor.setValue(source, 1);
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

	function getLibraries() {
		var result = [];
		var names = library.getData();
		for(var i = 0; i < names.length; i++) {
			var name = names[i];
			var lib = configs.libraries[name];
			var lines = lib.code.split("\n");
			for(var j = 0; j < lines.length; j++) {
				var line = lines[j];
				if(line != "" && result.indexOf(line) < 0) {
					result.push(line);
				}
			}
		}

		return result;
	}

	function getLine(line) {
		return editor.getSession().getLine(line);
	}

	function getCurrentLineInfo() {
		var pos = editor.getCursorPosition();
		var line = pos.row;
		var lineContent = $.trim(getLine(line));

		return {
			line: line + 1,
			lineContent: lineContent,
		};
	}

	function onResize() {
		editor.resize(true);
	}

	function onLibraryChange() {
		gen();
	}

	function onEditorChange(e) {
		EventManager.trigger("software", "editorChange");
	}

	function onSettingChange(option) {
		switch(option.type) {
			case "editor.theme":
				editor.setTheme("ace/theme/" + option.value);
				break;
			case "editor.tabSize":
				editor.getSession().setTabSize(option.value);
				break;
		}
	}

	return {
		init: init,
		load: load,
		getData: getData,
		setData: setData,
		gen: gen,
		maskCode: maskCode,
		getLibraries: getLibraries,
		getLine: getLine,
		getCurrentLineInfo: getCurrentLineInfo,
	};
});