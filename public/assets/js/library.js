define(['jquery', 'code', 'software'], function($, code, software) {
	var libraries;

	function init() {
		$('.library .list > li').on('click', onLibraryClick);
	}

	function load(_libraries) {
		libraries = _libraries;
	}

	function onLibraryClick(e) {
		var li = $(this);
		var name = li.data('library');
		var library = libraries[name];

		if (!library) {
			return
		}

		code.addLibrary(library.code);
		software.setSource(code.gen());
	}

	return {
		init: init,
		load: load,
	}
});