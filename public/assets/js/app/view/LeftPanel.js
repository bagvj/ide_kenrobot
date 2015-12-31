Ext.define('platform.view.LeftPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'leftPanel',
	baseCls: 'leftPanel',
	layout: 'card',
	width: 240,
	minWidth: 240,
	header: false,
	resizable: {
		handles: 'e',
		transparent: true,
	},
	collapsible: true,
	placeholder: {},
	collapseMode: "mini",
	collapseDirection: "left",
	hideCollapseTool: true,
	items: [{
		xtype: 'panel',
		layout: 'border',
		items: [{
			xtype: 'combo',
			region: 'north',
			baseCls: 'quickFind',
			hideLabel: true,
			displayField: 'text',
			typeAhead: true,
			queryMode: 'local',
			triggerAction: 'all',
			emptyText: '快速查找',
			selectOnFocus: true,
			indent: true,
		}, {
			xtype: 'treepanel',
			region: 'center',
			baseCls: 'leftSubPanel',
			header: false,
			rootVisible: false,
			useArrows: true,
			hideHeaders: true,
			root: {
				expanded: true,
				children: [{
					text: "输入模块",
					expanded: true,
					children: [{
						text: "按键",
						name: "button",
						leaf: true
					}, {
						text: "开关",
						name: "switch",
						leaf: true
					}]
				}, {
					text: "输出模块",
					expanded: true,
					children: [{
						text: "灯",
						name: "light",
						leaf: true
					}, {
						text: "数码管",
						name: "digitalTube",
						leaf: true
					}]
				}, {
					text: "执行模块",
					expanded: true,
					children: [{
						text: "舵机",
						name: "streeringEngine",
						leaf: true
					}, {
						text: "直流电机",
						name: "dcMotor",
						leaf: true
					}]
				}, {
					text: "传感模块",
					expanded: true,
					children: [{
						text: "光照",
						name: "illumination",
						leaf: true
					}, {
						text: "温度",
						name: "temperatue",
						leaf: true
					}]
				}, {
					text: "通讯模块",
					expanded: true,
					children: [{
						text: "串口输入",
						name: "serialPortIn",
						leaf: true
					}, {
						text: "串口输出",
						name: "serialPortOut",
						leaf: true
					}, {
						text: "IIC输入",
						name: "iicIn",
						leaf: true
					}, {
						text: "IIC输出",
						name: "iicOut",
						leaf: true
					}]
				}]
			}
		}],
	}, {
		baseCls: 'leftSubPanel',
		header: false,
		xtype: 'treepanel',
		rootVisible: false,
		useArrows: true,
		hideHeaders: true,
		root: {
			expanded: true,
			children: [{
				text: "app",
				expanded: true,
				children: [{
					text: "Build",
					name: "build",
					leaf: true
				}, {
					text: "Http",
					name: "http",
					leaf: true
				}]
			}, {
				text: "config",
				expanded: true,
				children: [{
					text: "navigation",
					name: "navigation",
					leaf: true
				}, {
					text: "database",
					name: "database",
					leaf: true
				}]
			}, {
				text: "public",
				expanded: true,
				children: [{
					text: "assets",
					name: "assets",
					leaf: true
				}, {
					text: "index.php",
					name: "index.php",
					leaf: true
				}]
			}]
		}
	}],
});