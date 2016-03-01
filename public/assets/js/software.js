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
			var chars = [];
			for(var i = 0; i < source.length; i++) {
				chars.push(String.fromCharCode(source[i]));
			}
			editor.setValue(chars.join(""), 1);
		}	
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