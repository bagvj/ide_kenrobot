Ext.define('platform.view.TopNav', {
	extend: 'Ext.toolbar.Toolbar',
	xtype: 'topNav',
	region: 'east',
	baseCls: 'topNav',
	defaults: {
		margin: 0,
		width: 50,
		height: 24,
	},
	items: [{
		text: '登录',
		xtype: 'button',
		name: 'login',
	}],
});