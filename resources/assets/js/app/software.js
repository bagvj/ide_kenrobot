define(['vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools', 'vendor/ace/ext-code_blast', 'vendor/jquery', './EventManager', './code'], function(_, _, _, _, _, _, _, _, EventManager, code) {
	var editor;
	var js_format_string = Module.cwrap("js_format_string", "string", ["string"]);

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
				win: "Ctrl-s",
				mac: "Command-s"
			},
			exec: function(editor) {
				EventManager.trigger('global', 'project.save');
			}
		}, {
			name: "buildProject",
			bindKey: {
				win: "Ctrl-b",
				mac: "Command-b"
			},
			exec: function(editor) {
				EventManager.trigger('global', 'project.build');
			}
		}, {
			name: "formatCode",
			bindKey: {
				win: "Ctrl-u",
				mac: "Command-u"
			},
			exec: function(editor) {
				EventManager.trigger('global', 'software.format');
			}
		}]);
		
		code.init(api);
		EventManager.bind("global", "resize", onResize);
	}

	function setData(data) {
		data = data || {};
		var source = data.source || code.gen();
		editor.setValue(source, 1);
	}

	function getData() {
		return {
			source: editor.getValue(),
		};
	}

	function gen() {
		editor.setValue(code.gen(editor.getValue()), 1);
	}

	function addLibrary(library) {
		code.addLibrary(library.code);
	}

	function format() {
		// var source = js_beautify(editor.getValue());
		// editor.setValue(source, 1);
		var placeholder = "codebender_reformat_cursor";
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

	function onResize() {
		editor.resize(true);
	}

	function onEditorChange(e) {
		EventManager.trigger("software", "editorChange");
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		gen: gen,
		addLibrary: addLibrary,
		format: format,
	};
});