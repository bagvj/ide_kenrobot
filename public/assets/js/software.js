define(['ace', 'ace-ext-language-tools', 'jquery', 'code'], function(_, _, $, code) {
	var editor;

	function init() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
		});
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/default");
		editor.session.setMode("ace/mode/arduino");
	}

	function setSource(source) {
		editor.setValue(source, 1);
	}

	function getSource() {
		var source = editor.getValue();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}
		return bytes;
	}

	return {
		init: init,
		getSource: getSource,
		setSource: setSource,
	};
});