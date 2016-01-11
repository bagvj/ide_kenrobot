Ext.define('platform.view.TopMenu', {
	extend: 'Ext.toolbar.Toolbar',
	xtype: 'topMenu',
	region: 'west',
	baseCls: 'topMenu',
	menuTriggerCls: "",
	padding: '0 0 0 60',
	defaults: {
		margin: 0,
		width: 60,
		height: 24,
	},
	items: [{
		text: '文件',
		xtype: 'button',
		menu: {
			baseCls: "topSubMenu",
			items: [{
				text: '新建',
			}, {
				text: '打开',
			}, {
				text: '保存',
			}, {
				text: '退出',
			}],
		},
	}, {
		text: '编辑',
		menu: {
			baseCls: "topSubMenu",
			items: [{
				text: '撤消',
			}, {
				text: '重做',
			}],
		},
	}, {
		text: '视图',
		menu: {
			baseCls: "topSubMenu",
			items: [{
				text: '输出',
			}, {
				text: '工具箱',
			}],
		},
	}, {
		text: '调试',
		menu: {
			baseCls: "topSubMenu",
			items: [{
				text: '运行',
			}, {
				text: '断点',
			}],
		},
	}, {
		text: '帮助',
		menu: {
			baseCls: "topSubMenu",
			items: [{
				text: '关于',
			}],
		},
	}],
});