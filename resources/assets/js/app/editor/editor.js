define(['vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools'], function() {
	var editor;

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

	return {
		init: init,

		getCode: getCode,
		setCode: setCode,
	}
});