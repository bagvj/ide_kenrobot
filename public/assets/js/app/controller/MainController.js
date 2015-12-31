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
			// 'bottomPanel > tabpanel': {
			// 	beforecollapse: this.onBottomPanelBeforeCollapse,
			// }
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

	onBottomPanelClosed: function(panel) {
		var tabPanel = this.getBottomSubPanel();
		if(tabPanel.items.getCount() == 1 && !tabPanel.getCollapsed()) {
			tabPanel.toggleCollapse();
		}
	},

	onBottomPanelBeforeCollapse: function(tabPanel) {
		console.log("onBottomPanelBeforeCollapse");
		var tabs = this.defaultBottomTabs;
		if(tabs.length == 0) {
			tabPanel.items.each(function(tab) {
				tabs.push(tab);
			});
		}

		console.log("count " + tabPanel.items.getCount() + " " + tabs.length);
		if(tabPanel.items.getCount() == 0) {
			tabPanel.items.addAll(tabs);
			console.log("count2 " + tabPanel.items.getCount());
			tabPanel.getLayout().setActiveItem(0);
		}
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
	}
});