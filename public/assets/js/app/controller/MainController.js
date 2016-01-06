Ext.define('platform.controller.MainController', {
	extend: 'Ext.app.Controller',
	requires: [
		'platform.view.TopPanel',
		'platform.view.LeftBar',
		'platform.view.LeftPanel',
		'platform.view.CenterPanel',
		'platform.view.RightBar',
		'platform.view.RightPanel',
		'platform.view.BottomPanel',
		'platform.view.StatusBar',
	],

	config: {
		defaultBottomTabs: [],
		toggleAll: true,
	},

	refs: [{
		ref: 'leftBar',
		selector: 'leftBar',
	}, {
		ref: 'leftPanel',
		selector: 'leftPanel',
	}, {
		ref: 'rightBar',
		selector: 'rightBar',
	}, {
		ref: 'rightPanel',
		selector: 'rightPanel',
	}, {
		ref: 'bottomPanel',
		selector: 'bottomPanel',
	}, {
		ref: 'bottomBar',
		selector: 'bottomPanel > tabbar',
	}, {
		ref: 'bottomSubPanel',
		selector: 'bottomPanel > tabpanel',
	}],

	init: function() {
		this.control({
			'leftBar > tab': {
				click: this.onLeftTabClick,
			},
			'rightBar > tab': {
				click: this.onRightTabClick,
			},
			'bottomPanel > tabbar > tab': {
				click: this.onBottomTabClick,
			},
			'bottomPanel > tabpanel > panel': {
				close: this.onBottomPanelClosed,
			},
			'topPanel toolbar button': {
				click: this.onTopToolItemClick,
			}
		});	
	},

	onLaunch: function() {

	},

	onLeftTabClick: function(tab){
		var panel = this.getLeftPanel();
		this.collapsePanel(tab, panel);
	},

	onRightTabClick: function(tab){
		var panel = this.getRightPanel();
		this.collapsePanel(tab, panel);
	},

	onBottomTabClick: function(tab){
		var panel = this.getBottomSubPanel();
		this.collapsePanel(tab, panel);
	},

	onTopToolItemClick: function(btn) {
		this.toggleAllPanel();
	},

	collapsePanel: function(tab, panel) {
		var layout = panel.getLayout();
		var activeItem = layout.getActiveItem();
		var items = layout.getLayoutItems();
		var count = items.length;
		var cardIndex = items.indexOf(activeItem);
		var tabIndex = tab.ownerCt.items.indexOf(tab);

		if(count == 0 || tabIndex == cardIndex) {
			panel.toggleCollapse();
		} else {
			if(panel.getCollapsed()) {
				panel.toggleCollapse();
			}
			if(count > tabIndex) {
				panel.getLayout().setActiveItem(tabIndex);
			}
		}
	},

	showAll: function(){
		this.toggleAllPanel(true);
	},

	hideAll: function() {
		this.toggleAllPanel(false);
	},

	toggleAllPanel: function(value) {
		if(value === undefined) {
			value = !this.toggleAll;
		}
		var leftBar = this.getLeftBar();
		var leftPanel = this.getLeftPanel();
		var rightBar = this.getRightBar();
		var rightPanel = this.getRightPanel();
		var bottomPanel = this.getBottomPanel()

		if(value) {
			leftBar.show();
			leftPanel.show();
			rightBar.show();
			rightPanel.show();
			bottomPanel.show();
		} else {
			leftBar.hide();
			leftPanel.hide();
			rightBar.hide();
			rightPanel.hide();
			bottomPanel.hide();
		}
		this.toggleAll = value;
	}
});