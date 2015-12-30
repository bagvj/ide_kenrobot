Ext.define('platform.view.RightBar', {
	extend: 'Ext.tab.Bar',
	xtype: 'rightBar',
	id: 'myRightBar',
	baseCls: 'rightBar',
	width: 24,
	defaults: {
		closable: false,
		listeners: {
			click: function(tab) {
				var cardPanel = Ext.getCmp("myRightPanel");
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
		}
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