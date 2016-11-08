define(['vendor/jquery', './EventManager'], function(_, EventManager) {
	var list;

	function init() {
		list = $('.top-menu .library ul > li').on('click', onLibraryClick);
	}

	function getData() {
		var libs = [];
		list.filter('.checked').each(function(i, item) {
			libs.push($(item).data('library'));
		});

		return libs;
	}

	function setData(libs) {
		reset();

		for(var i = 0; i < libs.length; i++) {
			var lib = libs[i];
			list.filter('[data-library="' + lib + '"]').addClass('checked');
		}
	}

	function onLibraryClick(e) {
		var li = $(this);
		li.toggleClass('checked');
			
		EventManager.trigger('library', 'change');
	}

	function reset() {
		list.removeClass('checked');
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
	}
});