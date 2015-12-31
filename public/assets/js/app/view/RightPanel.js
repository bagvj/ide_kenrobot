Ext.define('platform.view.RightPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'rightPanel',
	baseCls: 'rightPanel',
	layout: 'card',
	width: 240,
	minWidth: 240,
	header: false,
	resizable: {
		handles: 'w',
		transparent: true,
	},
	collapsible: true,
	collapsed: true,
	placeholder: {},
	collapseMode: "mini",
	collapseDirection: "right",
	hideCollapseTool: true,
	defaults: {
		baseCls: 'rightSubPanel',
	},
	items: [{
		xtype: 'panel',
		html: '属性',
	}, {
		xtype: 'panel',
		html: '调试',
	}],
});