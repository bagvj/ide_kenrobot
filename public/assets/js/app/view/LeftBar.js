Ext.define('platform.view.LeftBar', {
	extend: 'Ext.tab.Bar',
	xtype: 'leftBar',
	id: 'myLeftBar',
	baseCls: 'leftBar',
	width: 24,
	defaults: {
		closable: false,
		listeners: {
			click: function(tab) {
				var cardPanel = Ext.getCmp("myLeftPanel");
				var layout = cardPanel.getLayout();
				var activeItem = layout.getActiveItem();
				var items = layout.getLayoutItems();

				var cardIndex = items.indexOf(activeItem);
				var tabIndex = tab.ownerCt.items.indexOf(tab);

				if(tabIndex == cardIndex) {
					cardPanel.toggleCollapse();
				} else {
					cardPanel.getLayout().setActiveItem(tabIndex);
					if(cardPanel.getCollapsed()) {
						cardPanel.toggleCollapse();
					}
				}
			},	
		},
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