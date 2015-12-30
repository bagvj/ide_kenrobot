Ext.define('platform.controller.MainController', {
	extend: 'Ext.app.Controller',
	requires: [
		'platform.view.TopPanel',
		'platform.view.LeftBar',
		'platform.view.LeftPanel',
		'platform.view.CenterPanel',
		'platform.view.RightBar',
		'platform.view.RightPanel',
		'platform.view.BottomPanel',
		'platform.view.StatusBar',
	],
});