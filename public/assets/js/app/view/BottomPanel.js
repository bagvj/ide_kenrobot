Ext.define('platform.view.BottomPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'bottomPanel',
	id: 'myBottomPanel',
	items: [{
		xtype: 'tabpanel',
		id: "myBottomSubPanel",
		baseCls: 'bottomSubPanel',
		height: 240,
		header: false,
		resizable: {
			handles: 'n',
			transparent: true,
			minHeight: 240,
		},
		tabPosition: 'top',
		collapsible: true,
		collapsed: true,
		animCollapse: false,
		placeholder: {},
		collapseMode: "mini",
		collapseDirection: "top",
		hideCollapseTool: true,
		defaults: {
			closable: true,
			closeAction: 'hide',
			listeners: {
				removed: function(tab) {
					var tabPanel = tab.ownerCt;
					if(tabPanel.items.getCount() == 0 && !tabPanel.getCollapsed()) {
						tabPanel.toggleCollapse();
					}
				}
			},
		},
		items: [{
			title: '~/workspace',
		}, {
			title: 'logcat',
		}],
	}, {
		xtype: 'tabbar',
		height: 26,
		orientation: "horizontal",
		baseCls: 'bottomBar',
		defaults: {
			closable: false,
			listeners: {
				click: function() {
					var bottomSubPanel = Ext.getCmp("myBottomSubPanel");
					bottomSubPanel.toggleCollapse();
				},
			}
		},
		items: [{
			text: "输出",
			glyph: "xf120@FontAwesome",
		}],
	}],
});