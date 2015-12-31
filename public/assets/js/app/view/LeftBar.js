Ext.define('platform.view.LeftBar', {
	extend: 'Ext.tab.Bar',
	xtype: 'leftBar',
	baseCls: 'leftBar',
	width: 24,
	defaults: {
		closable: false,
	},
	orientation: "vertical",
	items: [{
		text: '工具箱',
		glyph: 'xf1b3@FontAwesome',
	}, {
		text: '文件树',
		glyph: 'xf07c@FontAwesome',
	}],
});