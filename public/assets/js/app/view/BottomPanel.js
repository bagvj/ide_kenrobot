Ext.define('platform.view.BottomPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'bottomPanel',
	items: [{
		xtype: 'tabpanel',
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
		},
		items: [{
			title: '~/workspace',
		}, {
			title: 'logcat',
		}],
	}, {
		xtype: 'tabbar',
		height: 24,
		orientation: "horizontal",
		baseCls: 'bottomBar',
		defaults: {
			closable: false,
		},
		items: [{
			text: "输出",
			glyph: "xf120@FontAwesome",
		}],
	}],
});