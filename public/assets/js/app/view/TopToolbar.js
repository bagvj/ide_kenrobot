Ext.define('platform.view.TopToolbar', {
	extend: 'Ext.toolbar.Toolbar',
	xtype: 'topToolbar',
	region: 'east',
	baseCls: 'topToolBar',
	padding: '0 10 0 0',
	defaults: {
		margin: '0 0 0 5',
		width: 22,
		height: 22,
	},
	items: [{
		glyph: 'xf002@FontAwesome',
		xtype: 'button',
		name: 'find',
	}, {
		glyph: 'xf013@FontAwesome',
		xtype: 'button',
		name: 'setting',
	}],
});