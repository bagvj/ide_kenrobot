Ext.define('platform.view.TopPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'topPanel',
	height: 48,
	items: [{
		xtype: 'panel',
		height: 24,
		layout: 'border',
		baseCls: 'topFirstPanel',
		items: [{
			xtype: 'topMenu',
		}, {
			xtype: 'topNav',
		}, {
			region: 'center',
		}], 
	}, {
		xtype: 'panel',
		height: 24,
		layout: 'border',
		baseCls: 'topSecondPanel',
		items: [{
			xtype: 'topToolbar',
		} , {
			region: 'center',
		}],
	}],
});