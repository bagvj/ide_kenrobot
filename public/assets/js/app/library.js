define(['jquery', './software'], function($, software) {
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

		software.addLibrary(library);
		software.gen();
	}

	return {
		init: init,
		load: load,
	}
});