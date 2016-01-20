Ext.define('platform.view.RightBar', {
	extend: 'Ext.tab.Bar',
	xtype: 'rightBar',
	baseCls: 'rightBar',
	width: 24,
	defaults: {
		closable: false,
	},
	orientation: "vertical",
	items: [{
		text: '属性',
		glyph: 'xf0ad@FontAwesome',
	}, {
		text: '调试',
		glyph: 'xf188@FontAwesome',
	}],
});