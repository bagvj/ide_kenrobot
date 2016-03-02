define(['jquery', 'bootstrap', 'typeahead', 'EventManager', 'util', 'hardware'], function($, _, _, EventManager, util, hardware) {
	var current;
	var components;

	function init() {
		$('.component .items .list > li').on('click', onComponentClick);
		EventManager.bind("hardware", "changeInteractiveMode", onChangeInteractiveMode);
	}

	function load(_components) {
		components = _components;
		initSearch();
	}

	function onChangeInteractiveMode(mode) {
		// var list = $('.component .items .list > li').off("click");
		if(mode == "drag") {

		} else {
			
		}
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