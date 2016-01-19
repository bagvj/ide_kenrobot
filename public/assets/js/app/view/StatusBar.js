Ext.define('platform.view.StatusBar', {
	extend: 'Ext.panel.Panel',
	xtype: 'statusBar',
	baseCls: 'statusBar',
	cls: 'x-unselectable',
	height: 24,
	layout: 'border',
	border: false,
	items: [{
		xtype: 'toolbar',
		region: 'west',
		baseCls: 'statusBarLeft',
		items: [{
			xtype: 'tbtext',
			text: '就绪',
		}],
	}, {
		xtype: 'toolbar',
		region: 'east',
		baseCls: 'statusBarRight',
		items: [{
			xtype: 'tbtext',
			text: 'UTF-8',
		}],
	}, {
		region: 'center',
	}],
});