Ext.define('platform.view.TopToolbar', {
	extend: 'Ext.toolbar.Toolbar',
	xtype: 'topToolbar',
	region: 'east',
	baseCls: 'topToolBar',
	defaults: {
		margin: '0 10 0 0',
		width: 22,
		height: 22,
	},
	items: [{
		glyph: 'xf002@FontAwesome',
		xtype: 'button',
	}, {
		glyph: 'xf013@FontAwesome',
		xtype: 'button',
	}],
});