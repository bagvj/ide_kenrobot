define(['jquery', 'bootstrap', 'typeahead', 'util', 'hardware'], function($, _, _, util, hardware) {
	var current;
	var components;

	function init() {
		$('.component .items .list > li').on('click', onComponentClick);
	}

	function load(_components) {
		components = _components;
		initSearch();
	}

	function onComponentClick(e) {
		var li = $(this);
		util.toggleActive(li);

		hardware.setPlaceComponent(li.data("component-name"));
	}

	function initSearch() {
		var sources = [];
		for(var key in components) {
			sources.push(components[key]);
		}
		$('.search .key').typeahead({
			source: sources,
			displayText: function(item) {
				return typeof item !== 'undefined' && typeof item.label != 'undefined' && item.label || item;
			},
			updater: function(item) {
				$('.component .items .list > li[data-component-name="' + item.name + '"').click();
				return item;
			}
		});
	}

	return {
		init: init,
		load: load,
	}
});