define(['vendor/jquery', './EventManager'], function(_, EventManager) {
	var list;

	function init() {
		list = $('.library .list > li').on('click', onLibraryClick);
	}

	function getData() {
		var libs = [];
		list.filter('.check').each(function(i, item) {
			libs.push($(item).data('library'));
		});

		return libs;
	}

	function setData(libs) {
		reset();

		for(var i = 0; i < libs.length; i++) {
			var lib = libs[i];
			list.filter('[data-library="' + lib + '"]').addClass('check');
		}
	}

	function onLibraryClick(e) {
		var li = $(this);
		li.toggleClass('check');
			
		EventManager.trigger('library', 'change');
	}

	function reset() {
		list.removeClass('check');
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
	}
});