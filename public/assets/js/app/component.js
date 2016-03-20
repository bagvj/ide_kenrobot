define(['jquery', 'jquery-ui', 'bootstrap-typeahead', './EventManager', './util', './hardware'], function($, _, _, EventManager, util, hardware) {
	var current;
	var components;
	var list;

	function init() {
		list = $('.component .items .list > li').on('click', onComponentClick)
		.draggable({
			disabled: true,
			appendTo: ".drag-layer",
			scope: "hardware",
			revert: true,
			revertDuration: 0,
			zIndex: 9999,
			containment: "window",
			helper: onCreateDrag,
		});
		EventManager.bind("hardware", "changeInteractiveMode", onChangeInteractiveMode);
	}

	function load(_components) {
		components = _components;
		initSearch();
	}

	function onChangeInteractiveMode(mode) {
		list.draggable("option", "disabled", mode != "drag");
	}

	function onComponentClick(e) {
		var li = $(this);
		util.toggleActive(li);

		hardware.setPlaceComponent(li.data("component-name"));
	}

	function onCreateDrag(e) {
		var name = $(this).data('component-name');
		var component = components[name];
		return $(".image", this).clone().css({
			width: component.width,
			height: component.height,
		}).data('component-name', name);
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