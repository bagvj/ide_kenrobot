Ext.define('platform.view.CenterPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'centerPanel',
	defaults: {
		xtype: "panel",
	},
	layout: "border",
	items: [{
		region: "west",
		xtype: "leftPanel",
	}, {
		region: "east",
		xtype: "rightPanel",
	}, {
		region: "south",
		xtype: "bottomPanel",
	}, {
		region: "center",
		baseCls: 'centerPanel',
		html: 'aaaa',
	}],
});