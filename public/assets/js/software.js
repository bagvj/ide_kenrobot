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
		if(!source || source.length == 0) {
			editor.setValue(code.gen(), 1);
		} else {
			editor.setValue(source);
		}	
	}

	function getSource() {
		return editor.getValue();
	}

	return {
		init: init,
		getSource: getSource,
		setSource: setSource,
	};
});