define(['ace/ace', 'ace/ext-language_tools', 'beautify', 'jquery', './EventManager', './code'], function(_, _, beautify, $, EventManager, code) {
	var editor;
	var js_beautify = beautify.js_beautify;

	function init(getNodes) {
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

		$('.software .back').on('click', function(e) {
			EventManager.trigger("project", "switchPanel", 0);
		});

		code.init(getNodes);
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
		var source = js_beautify(editor.getValue());
		editor.setValue(source, 1);
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